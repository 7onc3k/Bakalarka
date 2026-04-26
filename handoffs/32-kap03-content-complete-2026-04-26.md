# Handoff — Kap03 content-complete (2026-04-26)

## Stav

**Kap03 je content-complete.** Kapitola má jen jeden TODO marker, který je legitimní reminder na den odevzdání (git tag). Žádné scratch poznámky, žádné raw/draft bloky. Hotová struktura, terminologie sjednocená.

Sekce restrukturovaná do podoby:
```
3.1 Výzkumný přístup
   3.1.1 Volba výzkumné strategie
   3.1.2 Případ a~jeho prostředí (s tří rovinami IV/DV/setting)
   3.1.3 Fáze a~iterativní cyklus  ← přejmenováno + konsolidováno
       \paragraph{Pilotní fáze}        ← bývalé 3.3.4
       \paragraph{Ablace}              ← bývalé 3.3.5 (rename)
       \paragraph{Iterativní cyklus}   ← + diagram

3.2 Sada metrik
   3.2.1 Procesní (P1-P8)        ← 2 tabulky (P1-P5, P6-P8)
   3.2.2 Produktové (Q1-Q8)      ← 3 tabulky (Q1-Q2, Q3-Q4, Q5-Q8)
   3.2.3 Efektivita (E1-E3)      ← 1 tabulka
   3.2.4 Aplikace LLM-as-judge

3.3 Experimentální design        ← redukce z 5 na 3 subsekce
   3.3.1 Fixní proměnné
   3.3.2 Záznam a~vyhodnocení běhu  ← NOVÉ (konsolidace měřicí infry)
   3.3.3 Diagnostika a~úprava        ← s 5-rámcovou tabulkou + mapping

3.4 Přehledová tabulka
3.5 Omezení a~validita
```

## Co tato session udělala

Velký refactor kap03 + řada koordinovaných úprav navazujících kapitol. Konkrétní změny:

### 3.1.3 — strukturální konsolidace fází
- Rename "Iterativní cyklus a~fáze" → "Fáze a~iterativní cyklus" (pořadí podle obsahu)
- Konsolidace bývalých 3.3.4 (Pilotní fáze) a 3.3.5 (Komparativní variace) do `\paragraph{}` bloků
- "Komparativní variace" → "Ablace" napříč thesis (kap03, kap04, TERMINOLOGIE.md)
- Zachované labely (`sec:pilotni-iterace`, `sec:komparativni-variace`) přes `\phantomsection` — forward-refs z kap04, kap05, app01 fungují bez změny
- Drop pojmu "embedded single-case design" (méně metodologického jargonu k obhajobě)
- Drop redundance tří úrovní vs. dvou rovin (terminologický stret)

### 3.2 — metriky do tabulek
- Všech 19 metrik převedeno z prózy do tabulek po skupinách (Kód | Co měří | Jak se měří)
- Strukturální nuance (Q1 prereq Q2, Q8 minimum 5 dimenzí, Q7 práh, atd.) jako Poznámka pod tabulkou
- E3 vrácena na **jeden signál** (dokončení bez ztráty kontextu) — předchozí verze to expandovala na 3 signály v rozporu s commitem 22fb555

### 3.3.2 (nová) — Záznam a vyhodnocení běhu
- Konsoliduje měřicí infrastrukturu: skripty (`new-run.ts`, `analyze-run.ts`, `judge.ts`), artefakty (`transcript.json`, `FINDINGS.md`), iteračního výstupu (`DIAGNOSIS.md`, changelog)
- Tabulka 4 souborů (Soubor | Obsah)
- Pointer do repa s URL `https://github.com/7onc3k/Bakalarka` + zmínka o stabilním tagu

### 3.3.3 — Diagnostika a~úprava (přepsáno)
- Tabulka 5 diagnostických rámců (Mao FSE, Hassan SASE, Razavi/Breunig, Lulla, filter Li) s diagnostickými otázkami
- Lulla caveat jako footnote pod tabulkou (interpretativní použití)
- Mapovací tabulka klasifikace → primární rámec → typ opravy
- Honest framing: heuristika, ne algoritmus
- Kompaktní APO positioning s citacemi (PromptWizard, Prompt Alchemy, SAMMO)

### 3.5 — Omezení a~validita
- Drop "výzkumný design" terminologie (nikde jinde v kap03 nepoužíváme)
- Konsolidace AI disclosure (drop "Role AI v práci" odstavec z 3.5; zmínka v APO odstavci v 3.3.3 + odkaz na app01)
- "Claude" → "Claude Code", drop specifikace modelů (Opus 4, Sonnet 4)
- Coordinated edit s 3.2.2: AC25 manuální dopočet přesunut sem (konstruktová validita), popis referenčních testů přesunut k Q2

### Přílohy redukované
- Smazány: app02 (AGENTS.md baseline+final), app03 (judge rubrics), app04 (AI disclosure)
- `app01.tex` = AI disclosure (institucionální požadavek)
- Vše ostatní (procedure, šablony, AGENTS.md verze, rubriky, transcripty, surová data, spec) v repu — pointer v 3.3.2

### Bibliografie
- Přidány APO citace: `agarwal2024promptwizard`, `ye2025promptalchemy`, `schnabel2024sammo`

### `notes/finalizace.md` (nové)
- Lifecycle checklist pro odevzdání: git tag thesis-final, Zenodo DOI, build flags, FIS pravidla
- Memory entry `finalizace_checklist.md` zajišťuje, že to budoucí session uvidí

### Závěr
- Přidán TODO(zaver-prinos) — plánovaný 3-bodový claim přínosu s research notes:
  1. Sada 19 metrik P/Q/E
  2. Iterativní postup s 5-rámcovou diagnostikou
  3. Spektrum operacionalizace (compliance ordering + pairing heuristika)
- Research findings: taxonomie sama není nová (declarative/imperative + self-verification existují), claim přínosu = compliance-ordering pro coding agenty + pairing heuristika

## Klíčová decisions této session

### Spektrum operacionalizace zůstává jako kap05 finding
- NEzavádíme jako diagnostický slovník v 3.3.3
- Důvod: postupovali jsme podle procedury, spektrum vyplynulo implicitně z dat → empirický nález
- Research potvrdil: taxonomie čerpá z literatury, claim přínosu drží na (a) compliance-ordering pro coding agenty, (b) pairing heuristika

### Repo-only místo plných příloh
- User: "v práci je 100 stránek to se mi moc nelibi"
- Diskuze: co JE artefakt studie? Cíle 1-3 jsou metriky + postup + ablační poznatky → vše v thesis. Konkrétní AGENTS.md, spec, rubriky = replicability detail → repo
- Pouze AI disclosure musí v thesis (institucionální požadavek)

### Tag thesis-final až při odevzdání
- Kap03 deklaruje "Stav repozitáře k~datu odevzdání je zafixován gitovým tagem"
- Tag teď nelze vytvořit, protože práce není finální (zaver TODO, kap02 Yin TODO, kap04+kap05 ještě cleanup)
- TODO marker přesunut do `notes/finalizace.md` (operační checklist, ne content)

## Otevřené TODO (mimo kap03)

### `zaver.tex`
- `TODO(zaver-prinos)` — 3-bodový claim přínosu (research notes inline)
- `TODO(zaver-scope)` — co práce není (před doporučeními)
- `TODO(zaver-meta)` — meta-struktura uzavření

### `kap02.tex`
- `TODO(kap02-hodnoceni)` — zapracovat Yin et al. 2025 (arXiv:2511.00872)

### `notes/finalizace.md`
- Lifecycle akce na odevzdání (git tag, Zenodo DOI, build flags, InSIS, tisk)

## Plán dalších kroků

1. **Kap04 cleanup pass** — bezprostřední priorita
   - 4.1.x rename (drop "Konstrukce" — diskutováno v handoff 31)
   - Konzistence terminologie po dnešních změnách (cyklus/iterace/ablace)
   - Případně dodat materiál státního automatu / API kontraktu z app02 (smazaného), pokud kap04 na něj odkazoval
2. **Kap05 cleanup pass** — empirický nález o spektru operacionalizace zde dojednat (definice termínu, citace literatury z research notes)
3. **Závěr** — 3 TODO markery vyřešit (claim přínosu, scope, meta)
4. **Kap02** — Yin 2025 zapracovat
5. **Finální průchod celé práce** — TERMINOLOGIE.md sweep, raw bloky cleanup, build s `\hideraw`+`\hidedraft`

## Pravidla zachované z handoff 31

- Em-dash nepoužívat
- Doménové termíny česky ("případová studie", "ablace")
- Před editem subsekce ověřit forward-refs
- Bezpečné editace přes `Edit`, ne `Write`

## Snapshot

- Datum: 2026-04-26
- Lokace: `thesis/` (Overleaf-připojené, build via `make watch`)
- Backup: `thesis-checkpoint/` (gitignored, 387M)
- Repo HEAD: `d308247` (tip mainu po push)

## Co NEDĚLAT

- Necitovat APO citace (`schnabel2024sammo` atd.) jako "survey" — jsou to konkrétní techniky/papers, nikoli survey
- Nepoužívat "komparativní variace" — sjednoceno na "ablace"
- Nepoužívat "Claude" samostatně — vždy "Claude Code" v thesis textu (podle disclosure)
- Nezavádět "spektrum operacionalizace" jako pojem v kap03 (varianta b — finding patří do kap05)
- Nemíchat "kompakce kontextu" jako samostatný E3 signál — E3 je jeden signál (dokončení bez ztráty kontextu)
