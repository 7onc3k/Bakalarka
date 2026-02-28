#!/usr/bin/env python3
"""
Overleaf Sync Script
Synchronizuje lokální thesis/ složku s Overleaf projektem.

Použití:
    ./overleaf-sync.py pull    # Stáhne z Overleafu (s potvrzením)
    ./overleaf-sync.py push    # Nahraje do Overleafu (s potvrzením)
    ./overleaf-sync.py status  # Zobrazí stav
    ./overleaf-sync.py diff    # Zobrazí rozdíly

Flags:
    --yes, -y    Přeskočí potvrzení

Push automaticky:
    1. Nahraje .tex, .bib, .pdf, ... soubory
    2. Nahraje upravenou makra.tex (pdfx → hyperref, pro rychlou kompilaci)
    3. Nahraje předkompilovaný output.bbl (přeskočí biber)
    4. Nahraje latexmkrc (přeskočí biber, max 2 průchody)
"""

import sys
import os
import zipfile
import tempfile
import shutil
import hashlib
import re
from pathlib import Path

# Přidej venv do path
VENV_PATH = "/tmp/cookie-env/lib/python3.12/site-packages"
if VENV_PATH not in sys.path:
    sys.path.insert(0, VENV_PATH)

from pyoverleaf import Api

# Konfigurace
PROJECT_ID = "6974b85faa53f50a27ab247e"
THESIS_DIR = Path(__file__).parent.parent / "thesis"

# Soubory k synchronizaci
SYNC_EXTENSIONS = {'.tex', '.bib', '.txt', '.xmpdata', '.pdf'}
IGNORE_PATTERNS = {'*.aux', '*.log', '*.fls', '*.fdb_latexmk', '*.synctex.gz',
                   '*.toc', '*.out', '*.bbl', '*.blg', '*.bcf', '*.run.xml',
                   '*.xmpi', '*.lof', '*.lot'}
IGNORE_DIRS = {'sources'}  # Složky k ignorování (PDF knihy pro RAG)

# Overleaf-specific: latexmkrc content (skip biber, max 2 passes)
LATEXMKRC_CONTENT = '$biber = "true";\n$max_repeat = 2;\n'


def get_api():
    """Inicializuje API s cookies z prohlížeče."""
    api = Api()
    api.login_from_browser()
    return api


def should_sync(filepath):
    """Určí zda soubor synchronizovat."""
    path = Path(filepath)

    # Kontrola ignorovaných složek
    for part in path.parts:
        if part in IGNORE_DIRS:
            return False

    # Kontrola přípony
    if path.suffix.lower() not in SYNC_EXTENSIONS:
        # Povol soubory bez přípony nebo speciální
        if path.suffix:
            return False

    # Kontrola ignore patterns
    for pattern in IGNORE_PATTERNS:
        if path.match(pattern):
            return False

    return True


def strip_raw_blocks(content):
    """Odstraní \\begin{raw}...\\end{raw} bloky z .tex obsahu.
    Vedoucímu posíláme jen DRAFT a finální text."""
    return re.sub(r'\\begin\{raw\}.*?\\end\{raw\}', '', content, flags=re.DOTALL)


def make_overleaf_makra(content):
    """Upraví makra.tex pro Overleaf: pdfx → hyperref."""
    # Nahraď pdfx za hyperref (plain string replace, ne regex)
    content = content.replace(
        '\\usepackage[a-2u]{pdfx}     % výsledné PDF bude ve standardu PDF/A-2u\n'
        '                            % resulting PDF will be in the PDF / A-2u standard',
        '% pdfx disabled for Overleaf (too slow on free plan)\n'
        '% Final PDF/A version: compile locally with original makra.tex\n'
        '\\usepackage{hyperref}\n'
        '\\usepackage[usenames]{xcolor}'
    )

    # Odstraň podmíněné načítání xcolor (už je načtené výše)
    content = content.replace(
        '\\makeatletter\n'
        '\\@ifpackageloaded{xcolor}{\n'
        '   \\@ifpackagewith{xcolor}{usenames}{}{\\PassOptionsToPackage{usenames}{xcolor}}\n'
        '  }{\\usepackage[usenames]{xcolor}} % barevná sazba / color typesetting\n'
        '\\makeatother',
        '% xcolor already loaded above'
    )

    return content


def push_overleaf_extras(api, root_folder_id):
    """Nahraje Overleaf-specific soubory (upravená makra, .bbl, latexmkrc)."""
    extras = 0

    # 1. Upravená makra.tex (pdfx → hyperref)
    makra_path = THESIS_DIR / "makra.tex"
    if makra_path.exists():
        with open(makra_path, 'r') as f:
            original = f.read()
        modified = make_overleaf_makra(original)
        if modified != original:
            api.project_upload_file(PROJECT_ID, root_folder_id, 'makra.tex', modified.encode('utf-8'))
            print("  ⚡ makra.tex (pdfx → hyperref pro Overleaf)")
            extras += 1

    # 2. Předkompilovaný output.bbl
    bbl_path = THESIS_DIR / "prace.bbl"
    if bbl_path.exists():
        with open(bbl_path, 'rb') as f:
            content = f.read()
        api.project_upload_file(PROJECT_ID, root_folder_id, 'output.bbl', content)
        print(f"  ⚡ output.bbl ({len(content)} bytes)")
        extras += 1
    else:
        print("  ⚠️  prace.bbl neexistuje — spusť 'latexmk -pdf prace.tex' lokálně")

    # 3. latexmkrc (skip biber)
    api.project_upload_file(PROJECT_ID, root_folder_id, 'latexmkrc', LATEXMKRC_CONTENT.encode('utf-8'))
    print("  ⚡ latexmkrc (skip biber)")
    extras += 1

    return extras


def pull(api):
    """Stáhne projekt z Overleafu."""
    print(f"Stahuji projekt {PROJECT_ID}...")

    with tempfile.TemporaryDirectory() as tmpdir:
        zip_path = Path(tmpdir) / "project.zip"

        # Stáhni ZIP
        api.download_project(PROJECT_ID, str(zip_path))
        print(f"  Staženo: {zip_path.stat().st_size} bytes")

        # Rozbal
        extract_dir = Path(tmpdir) / "extracted"
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(extract_dir)

        # Kopíruj soubory do thesis/
        # Přeskakuj Overleaf-specific soubory (output.bbl, latexmkrc)
        overleaf_only = {'output.bbl', 'latexmkrc'}
        copied = 0
        for root, dirs, files in os.walk(extract_dir):
            rel_root = Path(root).relative_to(extract_dir)

            for filename in files:
                if filename in overleaf_only:
                    continue

                src = Path(root) / filename
                rel_path = rel_root / filename
                dst = THESIS_DIR / rel_path

                # Vytvoř složky
                dst.parent.mkdir(parents=True, exist_ok=True)

                # Při pull: makra.tex z Overleafu je upravená,
                # NEPŘEPISUJ lokální originál
                if filename == 'makra.tex':
                    print(f"  ⏭ {rel_path} (Overleaf verze, přeskakuji)")
                    continue

                # Kopíruj
                shutil.copy2(src, dst)
                print(f"  ✓ {rel_path}")
                copied += 1

        print(f"\nStaženo {copied} souborů do {THESIS_DIR}")


def push(api):
    """Nahraje projekt do Overleafu."""
    print(f"Nahrávám do projektu {PROJECT_ID}...")

    # Získej root folder ID
    root = api.project_get_files(PROJECT_ID)
    root_folder_id = root.id

    # Najdi nebo vytvoř img folder
    img_folder_id = None
    for child in root.children:
        if child.name == "img" and child.type == "folder":
            img_folder_id = child.id
            break

    if not img_folder_id:
        try:
            img_folder = api.project_create_folder(PROJECT_ID, root_folder_id, "img")
            img_folder_id = img_folder.id
            print("  Vytvořena složka img/")
        except:
            pass

    # Nahrávej soubory (kromě makra.tex — tu nahrajeme upravenou)
    uploaded = 0
    for filepath in THESIS_DIR.rglob("*"):
        if not filepath.is_file():
            continue

        rel_path = filepath.relative_to(THESIS_DIR)

        if not should_sync(rel_path):
            continue

        # makra.tex se nahraje upravená v push_overleaf_extras
        if rel_path.name == 'makra.tex':
            continue

        # Určí folder ID
        if rel_path.parts[0] == "img" and len(rel_path.parts) > 1:
            folder_id = img_folder_id
            filename = rel_path.parts[-1]
        else:
            folder_id = root_folder_id
            filename = str(rel_path)

        # Nahrát
        try:
            with open(filepath, 'rb') as f:
                content = f.read()

            # Odstraň RAW bloky z .tex souborů (vedoucí vidí jen DRAFT+)
            if filepath.suffix == '.tex':
                text = content.decode('utf-8')
                filtered = strip_raw_blocks(text)
                if filtered != text:
                    print(f"  🔸 {rel_path} (RAW bloky odstraněny)")
                content = filtered.encode('utf-8')

            api.project_upload_file(PROJECT_ID, folder_id, filename, content)
            print(f"  ✓ {rel_path}")
            uploaded += 1
        except Exception as e:
            print(f"  ✗ {rel_path}: {e}")

    # Nahrát Overleaf-specific soubory
    print("\n⚡ Overleaf optimalizace:")
    extras = push_overleaf_extras(api, root_folder_id)

    print(f"\nNahráno {uploaded} souborů + {extras} Overleaf extras")


def file_hash(filepath):
    """Vrátí MD5 hash souboru."""
    with open(filepath, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()


def get_diff(api):
    """Porovná lokální a vzdálené soubory. Vrátí (only_local, only_remote, modified)."""
    # Overleaf-only soubory ignorovat v diffu
    overleaf_only = {'output.bbl', 'latexmkrc'}

    # Stáhni vzdálené soubory do temp
    with tempfile.TemporaryDirectory() as tmpdir:
        zip_path = Path(tmpdir) / "project.zip"
        api.download_project(PROJECT_ID, str(zip_path))

        extract_dir = Path(tmpdir) / "extracted"
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(extract_dir)

        # Sbírej vzdálené soubory
        remote_files = {}
        for root, dirs, files in os.walk(extract_dir):
            rel_root = Path(root).relative_to(extract_dir)
            for filename in files:
                if filename in overleaf_only:
                    continue
                src = Path(root) / filename
                rel_path = str(rel_root / filename)
                if rel_path.startswith('.'):
                    rel_path = rel_path[2:]  # odstran ./
                remote_files[rel_path] = file_hash(src)

        # Sbírej lokální soubory
        local_files = {}
        for filepath in THESIS_DIR.rglob("*"):
            if filepath.is_file():
                rel_path = str(filepath.relative_to(THESIS_DIR))
                if should_sync(rel_path):
                    local_files[rel_path] = file_hash(filepath)

        # Porovnej (makra.tex je vždy jiná — Overleaf má upravenou verzi)
        only_local = set(local_files.keys()) - set(remote_files.keys())
        only_remote = set(remote_files.keys()) - set(local_files.keys())
        modified = set()
        for path in set(local_files.keys()) & set(remote_files.keys()):
            if path == 'makra.tex':
                continue  # vždy jiná (pdfx vs hyperref)
            if local_files[path] != remote_files[path]:
                modified.add(path)

        return only_local, only_remote, modified


def diff(api):
    """Zobrazí rozdíly mezi lokálním a vzdáleným."""
    print("Porovnávám lokální a vzdálené soubory...")
    only_local, only_remote, modified = get_diff(api)

    if not only_local and not only_remote and not modified:
        print("\n✓ Vše synchronizované, žádné rozdíly.")
        print("  (makra.tex se vždy liší — Overleaf má lehkou verzi bez pdfx)")
        return

    if only_local:
        print(f"\n📤 Pouze lokálně ({len(only_local)}):")
        for f in sorted(only_local):
            print(f"  + {f}")

    if only_remote:
        print(f"\n📥 Pouze na Overleafu ({len(only_remote)}):")
        for f in sorted(only_remote):
            print(f"  + {f}")

    if modified:
        print(f"\n📝 Změněné ({len(modified)}):")
        for f in sorted(modified):
            print(f"  ~ {f}")


def confirm(message):
    """Požádá o potvrzení."""
    response = input(f"\n{message} [y/N]: ").strip().lower()
    return response in ('y', 'yes', 'ano', 'a')


def status(api):
    """Zobrazí stav projektu."""
    print(f"Projekt: {PROJECT_ID}")
    print(f"Lokální: {THESIS_DIR}")
    print()

    # Vzdálené soubory
    root = api.project_get_files(PROJECT_ID)
    print("Vzdálené soubory (Overleaf):")

    def print_tree(node, indent=0):
        prefix = "  " * indent
        if node.type == "folder":
            print(f"{prefix}📁 {node.name}/")
            for child in node.children:
                print_tree(child, indent + 1)
        else:
            print(f"{prefix}📄 {node.name}")

    print_tree(root)

    # Lokální soubory
    print("\nLokální soubory (thesis/):")
    for filepath in sorted(THESIS_DIR.rglob("*")):
        if filepath.is_file():
            rel_path = filepath.relative_to(THESIS_DIR)
            if should_sync(str(rel_path)):
                print(f"  📄 {rel_path}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    # Parse args
    args = sys.argv[1:]
    skip_confirm = '-y' in args or '--yes' in args
    args = [a for a in args if a not in ('-y', '--yes')]

    command = args[0].lower()
    api = get_api()

    if command == "pull":
        # Ukáž změny před pull
        print("Kontroluji změny před stažením...")
        only_local, only_remote, modified = get_diff(api)

        if only_remote:
            print(f"\n📥 Nové soubory z Overleafu ({len(only_remote)}):")
            for f in sorted(only_remote):
                print(f"  + {f}")

        if modified:
            print(f"\n⚠️  Tyto lokální soubory budou přepsány ({len(modified)}):")
            for f in sorted(modified):
                print(f"  ~ {f}")

        if not only_remote and not modified:
            print("\n✓ Žádné změny ke stažení.")
            return

        if not skip_confirm and not confirm("Pokračovat se stažením?"):
            print("Zrušeno.")
            return

        pull(api)

    elif command == "push":
        # Ukáž změny před push
        print("Kontroluji změny před nahráním...")
        only_local, only_remote, modified = get_diff(api)

        if only_local:
            print(f"\n📤 Nové soubory k nahrání ({len(only_local)}):")
            for f in sorted(only_local):
                print(f"  + {f}")

        if modified:
            print(f"\n⚠️  Tyto soubory na Overleafu budou přepsány ({len(modified)}):")
            for f in sorted(modified):
                print(f"  ~ {f}")

        if not only_local and not modified:
            print("\n✓ Žádné změny k nahrání (ale Overleaf extras se aktualizují).")

        if not skip_confirm and not confirm("Pokračovat s nahráním?"):
            print("Zrušeno.")
            return

        push(api)

    elif command == "status":
        status(api)

    elif command == "diff":
        diff(api)

    else:
        print(f"Neznámý příkaz: {command}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
