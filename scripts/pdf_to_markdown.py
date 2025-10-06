#!/usr/bin/env python3
"""
Převod PDF do Markdown s formátováním
"""

import subprocess
import re
import sys

def pdf_to_markdown(pdf_path, output_path):
    """Převede PDF na Markdown s formátováním"""

    # Získat text z PDF
    result = subprocess.run(
        ['pdftotext', '-layout', pdf_path, '-'],
        capture_output=True,
        text=True,
        check=True
    )

    text = result.stdout
    lines = text.split('\n')

    markdown_lines = []
    in_list = False

    for i, line in enumerate(lines):
        # Přeskočit prázdné řádky na začátku
        if not markdown_lines and not line.strip():
            continue

        # Detekce hlavního nadpisu (velká písmena, krátký řádek)
        if i < 5 and len(line.strip()) > 0 and len(line.strip()) < 80:
            if not line.strip().startswith('('):
                markdown_lines.append(f"# {line.strip()}")
                continue
            else:
                markdown_lines.append(f"## {line.strip()}")
                continue

        # Detekce nadpisů (řádky které končí bez tečky a začínají velkým písmenem)
        stripped = line.strip()
        if stripped and len(stripped) < 100:
            # Kontrola zda je to nadpis sekce
            if (stripped[0].isupper() and
                not stripped.endswith('.') and
                not stripped.endswith(',') and
                not stripped.endswith(';') and
                not re.search(r'\d\s*$', stripped) and  # nekončí číslem (reference)
                not stripped.startswith('•') and
                i > 0 and not lines[i-1].strip()):  # předchozí řádek je prázdný

                # Určit úroveň nadpisu
                if 'Výběr' in stripped or 'Osnova' in stripped or 'Vyhledávání' in stripped or 'Postupné' in stripped or 'Běžné' in stripped or 'Užitečné' in stripped or 'Závěrem' in stripped or 'Návrh' in stripped or 'Revizní' in stripped:
                    markdown_lines.append(f"\n## {stripped}\n")
                    continue

        # Detekce seznamů
        if re.match(r'^\s*[•\-\*]\s+', line) or re.match(r'^\s*\d+\.\s+', line):
            if not in_list:
                markdown_lines.append("")
                in_list = True
            # Zachovat odrážky
            markdown_lines.append(line.rstrip())
            continue
        elif in_list and not stripped:
            in_list = False
            markdown_lines.append("")
            continue
        elif in_list and stripped:
            # Pokračování seznamu
            markdown_lines.append(line.rstrip())
            continue

        # Detekce odkazů (na konci dokumentu)
        if re.match(r'^\s*https?://', stripped):
            markdown_lines.append(f"- {stripped}")
            continue

        # Zvýraznění důležitých slov tučně
        line_formatted = line
        # Zvýraznit důležité termíny
        for term in ['ChatGPT', 'Zotero', 'Google Scholar', 'Overleaf', 'Wikipedia', 'DŮLEŽITÉ', 'POZOR']:
            if term in line_formatted:
                line_formatted = line_formatted.replace(term, f"**{term}**")

        # Přidat normální řádek
        if stripped:
            markdown_lines.append(line_formatted.rstrip())
        else:
            # Zachovat prázdné řádky pro odstavce
            markdown_lines.append("")

    # Spojit řádky a vyčistit
    markdown_text = '\n'.join(markdown_lines)

    # Vyčistit vícenásobné prázdné řádky
    markdown_text = re.sub(r'\n{3,}', '\n\n', markdown_text)

    # Zapsat do souboru
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(markdown_text)

    print(f"✓ PDF převeden do Markdown: {output_path}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Použití: python3 pdf_to_markdown.py <vstupni.pdf> <vystupni.md>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_path = sys.argv[2]

    pdf_to_markdown(pdf_path, output_path)
