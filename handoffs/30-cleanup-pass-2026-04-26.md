# Handoff — Cleanup pass thesis (2026-04-26)

## Aktuální fáze

**Cleanup pass.** Text je hotový a buildí se. Procházíme kapitoly sekci po sekci, hledáme nedostatky (nesoulad, slabé claimy, vágní formulace) a odstraňujeme audit trail bloky (`\begin{raw}...\end{raw}`).

- **Snapshot s plnou historií**: `thesis-checkpoint/` v rootu (387M, gitignored? — uživatel řekl ne, takže není v gitignore — k ověření)
- **Pracovní složka**: `thesis/` (Overleaf-připojená)
- **Restore kdykoli**: `git checkout thesis/<file>` nebo `cp thesis-checkpoint/<file> thesis/<file>`

## Co je hotovo

| Soubor | Před | Po | Akce |
|---|---|---|---|
| `uvod.tex` | 50 | 36 | 1 raw blok smazán (čistá historie verzí) |
| `kap01.tex` | 295 | 91 | 6 raw bloků smazáno; opraveno: "smíšená"→"nejednoznačná", "požadované praktiky"→"požadované chování"; cíl 2 změněn (viz "Decisions") |
| `kap02.tex` | 1654 | 594 | 19 raw bloků + 7 navigačních markerů `% === X.Y ===` + 1 orphan banner smazány. Žádné obsahové změny. |
| `kap03.tex` | 952 | 678 | 15 raw bloků + 2× `%% KOSTRA` plánovací bloky + 1 orphan banner smazány. **2 TODO značky vloženy (viz níže).** |
| `zaver.tex` | 67 | 53 | 1 raw blok smazán; opraveno operacionalizace formulace (varianta A); cíl 3 reformulován (varianta C); cíl 1 + cíl 2 sjednoceny napříč prací |
| `kap04.tex` | 1101 | — | **NEČIŠTĚNO** — 9 raw bloků + 2× `% TODO(acro)` + 1× `%% TODO` |
| `kap05.tex` | 1077 | — | **NEČIŠTĚNO** — 11 raw bloků + 3× `%% TODO` |

## Decisions (dnes)

### Cíle práce — sjednocené formulace napříč kap01/kap05/závěr

**Cíl 1** (kap01.tex:166-169 + kap05.1.1 quote):
> "Na základě analýzy existujících standardů kvality softwaru a~současných benchmarků pro AI agenty navrhnout sadu metrik pokrývající proces, kvalitu kódu a~efektivitu, a~tím zachytit dimenze, které stávající benchmarky neměří."

**Cíl 2** (kap01.tex:170-173 + kap05.1.2 quote):
> "Na případové studii demonstrovat iterativní postup návrhu instrukcí řízený těmito metrikami a~vyhodnotit, zda a~jak vede k~měřitelným změnám v~chování agenta podle navržených metrik."

**Cíl 3** (kap01.tex:174-176 + kap05.1.3 quote):
> "Z~instrukcí vytvořených v~cíli~2 prozkoumat ablacemi, které složky přispívají k~měřenému chování agenta a~které jsou redundantní."

**Závěr cíl 1**: "navrhnout sadu metrik pokrývající proces, kvalitu kódu a~efektivitu, a~tím rozšířit hodnocení nad rámec pass/fail výsledku."
**Závěr cíl 2**: "iterativním postupem navrhnout instrukce a~vyhodnotit měřitelné změny v~chování agenta podle navržených metrik."
**Závěr cíl 3**: "ablacemi prozkoumat, které složky instrukční sady přispívají k~měřenému chování agenta a~které jsou redundantní."

### Jiné decisions

- **Operacionalizace v závěru** (zaver.tex:29-30): "U~požadavků bez takového nástroje zůstává instrukce na úrovni pravidla nebo příkazu bez vnější zpětné vazby." — varianta A z dřívějšího návrhu (vyhnout se slovu "operacionalizace" v závěru).
- **Cíl 3 v závěru — softer claim** (zaver.tex:33-35): "Ablace potvrdila závislost klíčových metrik na verifikačních krocích, kterou pilotní fáze už naznačila" (místo "Verifikační kroky se ukázaly jako neredundantní" — zeslabuje claim, protože ablace A byla retrospektivně předvídatelná).
- **APO positioning** = patří do kap03 (metodika), ne kap02 (teorie). Důvod: APO je metodologický rámec, vůči kterému se vymezujeme manuální diagnózou.
- **Karpathy "auto research"** = nepoužívat, není peer-reviewed. Místo toho cite PromptWizard/DSPy/PromptAlchemy.
- **Generalizovatelnost** = pouze konstrukce sady metrik je přenositelná, ne metriky samy. Loop je APO známé, naším přínosem je doménově-specifická vrstva (P/Q/E + 4-framework diagnostika + spektrum operacionalizace).

## Pending TODO značky v textu

### kap03.tex

**ř. 37–41** (po Hevner+Peffers anchor v 3.1):
```
% TODO(BP-positioning): doplnit vymezení vůči APO (PromptWizard, DSPy,
% Prompt Alchemy). Loop sám není novum; novum je (1) sada P/Q/E pro
% coding agenty, (2) manuální diagnóza přes 4 rámce odhalí PROČ instrukce
% selhala, kde APO score→synthesize zachytí jen CO. Materiál v původních
% raw blocích kap02 (APO přístupy a předpoklady které pro nás neplatí).
```

**ř. ~534** (před popisem 4-framework diagnostiky v 3.3.3):
```
% TODO(BP-positioning): Tato čtyřrámcová diagnostika je naše syntéza —
% žádný z těchto papers se v literatuře nepoužívá společně jako
% diagnostický toolkit. Zvážit explicitní zmínku že kombinace 4 rámců
% je naším přínosem (vedle P/Q/E + spektra operacionalizace).
```

## Pending strukturní úprava (kap03 preambule)

**Stav**: Aktuální preambule kap03 má jen "tři roviny" framing, ale chybí roadmap. Anchor na kap01/kap02 + roadmap je teď v 3.1 první odstavec, kde nepatří.

**Návrh**: přesunout anchor (prevní odstavec 3.1) do preambule, přidat 3. odstavec preambule s roadmapou sekcí 3.1–3.5, 3.1 začne rovnou "Navrhujeme sadu metrik a iterativní postup..." (současný druhý odstavec).

Konkrétní text návrhu — viz konverzace 2026-04-26 (search "Návrh — přepsat preambuli na 3 odstavce").

## Možný rollback (substantivní blok smazaný v kap03)

Při bulk-delete kap03 byl smazán jeden substantivní blok (originál ř. 592-714, ~122 řádků) obsahující **expanded popis 4-framework diagnostiky**: konkrétní checklisty, tabulka rámců (FSE/SASE/Lulla/Breunig × Otázka × Co analyzuje × Výstup), 4-krokový recovery postup pro Breunig/Razavi, FSE 7 komponent v doporučeném pořadí, SASE script balance ratio.

**Současný finální 3.3.3 má jen kondenzovanou verzi** (4 bullets + 3-step procedura). Pokud bude APO TODO doplněno explicitně jako "naše čtyřrámcová syntéza je přínos vůči APO", může dávat smysl restorovat ten expanded protokol z `thesis-checkpoint/kap03.tex`. K rozhodnutí.

## Plán dál (next session)

1. **kap04 cleanup** — per-block review tentokrát (uživatel požádal, žádný bulk-delete bez diskuze):
   - 9 raw bloků
   - 2× `% TODO(acro)` v ř. 815, 958 (bare P5 → \acs{P5})
   - 1× `%% TODO` ř. 1081 (zvážit zmínku konzistentního selhání ref testu)
2. **kap05 cleanup** — per-block review:
   - 11 raw bloků
   - 3× `%% TODO` ř. 209, 711, 905
3. **Doplnit APO pozicování** v kap03 (vyřešit dvě TODO značky)
4. **Restruktualizace preambule kap03** podle návrhu výše
5. **Případně**: rozhodnout o restore expanded 4-framework protokolu

## Pravidla pro next session

- **Per-block review**, ne bulk-delete (uživatel ztrácí kontrolu při bulk-delete substantivních bloků)
- **Audit trail bloky** = třídit DELETE (čistá historie) / EXTRACT (nedořešený TODO/materiál) / KEEP (potřebné)
- **Před každou strukturální změnou** ukázat obsah, ne jen meta-popis
- **Kosmetika** (`%% === ===` banners, `%% KOSTRA:`, navigation markers) lze řešit hromadně

## Klíčová memory pravidla (relevantní)

- `feedback_thesis_brevity.md` — čtivý text, ne telegrafický
- `feedback_theory_methodology_split.md` — selection/scope/forward-refs do kap03, ne kap02
- `thesis_full_pass_rules.md` — chapter contracts, validation gates
- CLAUDE.md (project) — em dash nepoužívat, doménové termíny česky, em-dash ban

## Co NEDĚLAT

- Necitovat Karpathy / industry blog posts (neakademické)
- Nepřidávat APO citace do kap02 (patří do kap03)
- Nereformulovat cíle dál, jsou nyní konzistentní
- Necompactovat thesis-checkpoint (snapshot k 2026-04-26)
