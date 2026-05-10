# Handoff: pre-submission checklist BP

Datum: 2026-05-10
Termín odevzdání: **pondělí 11. 5. 2026, 12:00** (InSIS, opatření děkana FIS 11/2018)
Branch: `dev` (PR #68 už mergnut do `main`)

## Kontext

Základ checklistu vznikl z 5 paralelních auditů (reference, cíle/PQE,
styl, front matter, FIS odevzdání). Detailní zdroje v sekci "Audit
trail" níže.

Pracovní strom má necommitnuté změny v `thesis/kap01-05.tex`,
`zaver.tex`, `prace-clean.pdf` z probíhající kap05 revize. Tyto změny
jsou nezávislé na tomto checklistu — projít je odděleně.

---

## P0 — BLOCKERY (musí před odevzdáním)

### Obsah a formality

- [x] **Anglický název práce** — REVIDOVÁNO. Recent FIS BP (3
      prohlédnuté 2023–2025) mají na title page jen CZ název. EN
      název jde jen do InSIS metadata při uploadu. Žádná změna v
      PDF zdrojácích netřeba, jen mít EN název připravený na zítra.
- [x] **Prohlášení o autorství** — REVIDOVÁNO. Recent FIS BP nemají
      prohlášení v PDF (řeší se přes InSIS). Naše práce má
      `prohlaseniAI.tex` s AI disclosure — ponecháno (lepší přehnat
      než vynechat, AI disclosure je novější étiketa). Podpis se v
      PDF neřeší.
- [x] **EN název pro InSIS:** "Design and Testing of an Environment
      for AI Agents in Software Development" (doslovný překlad CZ).
- [x] **EN abstract zkrácen z 306 → ~264 slov** v `prace.tex` `\AbstraktEN`.
      Zachována parita s CZ obsahem; sémantické posuny opraveny
      ("Results show that the metrics can distinguish",
      "deterministic metrics" zachováno místo "automated").
- [ ] **Klíčová slova 5 → 3.** FIS InSIS workflow chce 3 klíčová slova
      v každém jazyce. Práce má v `uvod.tex` 5. Ověřit šablonu a buď
      redukovat v PDF, nebo nechat 5 v PDF a 3 vybrat při uploadu.
- [x] **`thesis/kap03.tex:39`** — smazán zastaralý RAW TODO komentář.
- [x] **6 prázdných bib entries** smazány z `thesis/literatura.bib`
      (`memorymechanism2024`, `amem2025`, `humanai2024`,
      `contextmodule2024`, `bugfixcontext2025`, `gcc2025`). Ověřeno
      že nebyly nikde citované.

### Konzistence

- [x] **Q7 label sjednoceno** na "Porušení složitosti":
      `makra.tex:266`, `kap03.tex:604, 931`. `kap04.tex` už OK.
      `kap02.tex:231` o pojmu cyklomatická složitost ponechán
      (literatura McCabe).
- [x] **`uvod.tex`** — "pracovní postup agenta" → "proces" na obou
      místech (sjednoceno s cíly v `kap01.tex:58-60`).
- [x] **`app01.tex:44` "GLM-5"** ověřeno — korektní. Config:
      `experiments/infra/scripts/ts/shared.ts:29` =
      `bailian-coding-plan/glm-5`.

---

## P1 — POLISH (doporučeno opravit)

- [x] **`kap05.tex` "nelze" shluk** — 3 instance přepsány:
      `:514` "Tento vliv se mísí s efektem samotných změn instrukcí",
      `:522` "Přesto je možné, že...",
      `:554` "zůstává síla tohoto závěru otevřená".
      Ponecháno: `:474` (primární statement), `:575` (klíčový
      metodologický bod), `:601` (definiční).
- [x] **`kap05.tex:88, 101, 127` bare Q kódy** v italic paragraph
      headers ponecháno jako stylistický záměr. Acro makra v běhu
      textu pod headery jsou OK.

---

## P2 — NICE-TO-HAVE

- [ ] Prořez 115 unused bib entries v `thesis/literatura.bib`.
- [ ] `kap03.tex:833-835` mapping tabulka — redukovat dva `\textcite`
      v jedné buňce na primární zdroj.

---

## ADMIN — odevzdání 11. 5. do 12:00

### Před uploadem

- [ ] **Final build** — `make -C thesis prace-clean` po všech opravách.
- [ ] **Verifikovat název v InSIS = název v PDF** (jinak InSIS nepřijme,
      opatření 11/2018 čl. 12 odst. 2).
- [x] **Git tag `thesis-final`** přesunut na `5f67391`
      (release/thesis-final branch). Tento commit obsahuje POUZE
      `experiments/`, `README.md`, `.gitmodules`, `.gitignore` —
      thesis source, handoffs, notes a jiné autorské materiály
      odstraněny pro čistý reader-facing snapshot.
      Branch i tag pushnuty na origin.

### InSIS workflow (ráno 11. 5.)

- [ ] Portál studenta → Závěrečná práce → "Vložit doplňující informace"
      (jazyk, název CZ+EN, abstrakt CZ+EN, 3 klíčová slova CZ+EN).
- [ ] Upload PDF + označit k odevzdání.
- [ ] Zkontrolovat zelený check u "Operace studenta" — bez něj práce
      není odevzdaná.

### Email katedře

- [ ] **Ověřit u vedoucího / na intranetu FIS** formát + adresát
      notifikačního emailu (KIT/KIZI ho vyžadují, formát je v
      intranetu fakulty).
- [ ] **Ověřit u vedoucího nebo sekretářky katedry**, jestli katedra
      nemá interní formulář navíc nad rámec opatření 11/2018.

### Backup kontakty

- fisbachelor@vse.cz
- +420 224 095 464
- NB 412 (Nová budova, 4. patro)
- Úřední hodiny: Po+St 8:30–11:30 a 13:00–15:00

---

## Co NEdělat

- Tisk / pevná vazba (FIS od 2020 nevyžaduje, opatření 11/2018 změna 14)
- PDF/A konverze (FIS nevyžaduje)
- Předávací protokol / souhlas se zveřejněním samostatně (workflow je
  čistě InSIS, souhlas dán automaticky podle § 47b zákona 111/1998 Sb.)
- Antiplagiátorský upload navíc (běží automaticky mezi odevzdáním
  a obhajobou)

---

## Audit trail

Pět subagent reportů z 2026-05-10:

1. **Reference + citace** — všechny `\ref`/`\cite` rozřešeny, žádný
   `??` v PDF, GitHub URLs OK na `tree/thesis-final`, ISO citace
   formálně OK. Findings: 6 prázdných bib entries, 115 unused entries
   (volitelné).
2. **Cíle 1/2/3 + P/Q/E konzistence** — cíle v úvodu ↔ závěru sedí
   doslovně, kap02 čistá od experimentálních úniků, kap03↔kap04 split
   čistý. Findings: terminologický drift "proces" v úvodu, Q7 label
   drift, bare Q kódy v 3 italic headers v kap05.
3. **Stylistická čistota** — em dash 0, AI dvojtečky 0, "naše
   výsledky" 0, žádné trailing dots v headers, `\textcolor` jen
   v legitimní tabulce kap05. Findings: RAW TODO v kap03:39,
   defenzivní shluk "nelze" v kap05 limits.
4. **Front matter + přílohy** — title page, prohlášení, poděkování,
   acro/listoffigures, app01/app02 OK; `make prace-clean` posílá
   `\hideraw \hidedraft` korektně. Findings: chybí EN název, EN
   abstract 306 slov (přes limit), klíčových slov 5 (FIS chce 3),
   "GLM-5" v app01 verifikovat.
5. **FIS odevzdání** — opatření děkana FIS 11/2018, čl. 9–17. Klíčové
   zdroje:
   - https://fis.vse.cz/wp-content/uploads/page/579/Opatreni_2018_11.pdf
   - https://kit.vse.cz/aktuality/terminy-statnich-zkousek-a-obhajob-2025-26/
   - https://fis.vse.cz/fakulta/organy-fakulty/studijni-oddeleni/

## Stav repa v okamžiku handoffu

- Branch: `dev`, sync s `origin/dev`
- PR #68 mergnut do `main` (2026-05-10)
- Closeé issues: #51, #62, #63, #64, #65, #66
- Necommitnuté: thesis/kap01-05.tex, zaver.tex, prace-clean.pdf,
  konzultace/10, notes/daily/2026-05-07.md
- Untracked: handoffs/41, handoffs/42, handoffs/43 (tento)
- Tag `thesis-final` existuje (na starším commitu, nepřesouvat
  bez schválení)
