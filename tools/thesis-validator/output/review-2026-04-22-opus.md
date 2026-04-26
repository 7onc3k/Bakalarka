# Recenze

## Meta
- Datum: 2026-04-22
- Typ práce: Bakalářská práce
- Model: claude-opus-4-7
- Poznámka ke vstupu: dodaný export obsahuje hlavní text práce, citovanou bibliografii a textově zjednodušenou podobu LaTeXu; tabulky jsou částečně rozbité formátováním, přílohy v exportu nejsou.

---

## First-Principles Analysis (per sekce)

### Úvod
**Expectation:** Úvod má (a) zarámovat problém pro neodborného čtenáře, (b) ukázat mezeru ve výzkumu/praxi, (c) stručně oznámit přístup a strukturu práce. Nemá obsahovat detailní výsledky ani metodiku.
**Reality:** Úvod tyto tři role plní: identifikuje mezeru (chybějící holistický pohled na hodnocení agentů), zmiňuje instrukční soubory jako klíčové rozhraní, ohlašuje case study s upomínkami faktur a nastiňuje strukturu. Délka přiměřená.
**Gaps:**
- Chybí explicitní formulace výzkumné otázky (pouze implicitně přes „otevřenou otázku").
- Tvrzení „současné benchmarky hodnotí izolované aspekty" nemá v úvodu citaci (citace je až v kap. 1) — pro zcela samostatně čtený úvod by se hodila.
- Není zmíněn typ práce / metodologický přístup (case study), což by čtenář ocenil.

### Vymezení problému a cílů (kap. 1)
**Expectation:** Měla by ostře formulovat problém, zdůvodnit relevanci citacemi, definovat cíle SMART způsobem a vymezit rozsah/limity.
**Reality:** Sekce má motivaci, tři cíle a rozsah. Cíle jsou poměrně konkrétní, scope je přiznán (jeden projekt, jeden model). Citace METR, Ehsani, Shin, Lulla, Gloaguen jsou použité konzistentně.
**Gaps:**
- Cíl 1 obsahuje sloučená dvě tvrzení („navrhnout sadu metrik" + „zachytit dimenze, které benchmarky neměří"). Druhý claim je obtížně ověřitelný — měřitelnost cíle se snižuje.
- Cíl 3 („prozkoumat ablacemi") je formulován procedurálně; chybí kritérium úspěchu.
- Tvrzení „Shin et al. ukazují, že iterativní zpřesňování instrukcí dosahuje srovnatelných výsledků s fine-tuned modely" je silnější než opora — Shin et al. zkoumají specifický kontext code, generalizace na „srovnatelné výsledky" je hraniční.
- Není odlišeno feasibility vs. generalizability claim ostře hned v cílech (až ve scope).

### Teoretická východiska (kap. 2)
**Expectation:** Má syntetizovat literaturu tak, aby z ní logicky vyplynul metrický rámec a designové volby. Ne lineární přehled „A říká X, B říká Y", ale stavební blok pro metodiku.
**Reality:** Strukturováno do tří částí: kvalita SW (modely, praktiky, měření) a AI agenti (pojmy, scaffolding, hodnocení). Syntéza je spíše dobrá: McCall→ISO 25010→Brooks→Lehman→praktiky→Fenton & Bieman→konkrétní metriky. Sekce o LLM-as-judge a test oracle problem jsou užitečné.
**Gaps:**
- Vazba mezi ISO 25010 (produktové charakteristiky) a Fenton & Bieman (proces/produkt/zdroj) je vysvětlena („jiný řez problémem"), ale operacionalizace zůstává implicitní.
- Sekce „Praktiky podporující udržovatelnost" je velmi krátká a generická (McConnell), nezachycuje moderní praktiky relevantní pro LLM (např. property-based testing, kontraktové programování).
- Tvrzení „self-recognition → self-preference" (Panickssery) prezentováno jako kauzální vztah, ale i původní paper hovoří o silné korelaci, kauzalita je tam zarámována opatrněji.
- Chybí explicitní propojení mezi SE4A (Hassan) a vlastním rámcem P/Q/E — uvedl bych alespoň jednou větou, jak SE4A motivuje rozdělení.
- V sekci „Hodnocení AI agentů" jsou tři novější studie (METR, Li, Ehsani) zmíněny opakovaně — text se občas opakuje s úvodem.

### Metodika (kap. 3)
**Expectation:** Má operacionalizovat cíle: design experimentu, sadu metrik s exit kritérii, postup, validitní úvahy. Měla by být reprodukovatelná a obhajitelná.
**Reality:** Rozsáhlá kapitola, definuje 19 metrik (P1–P8, Q1–Q8, E1–E3), čtyřkrokový iterativní cyklus, fixní proměnné, ablace, validitní limity dle Runeson & Höst. Většina metrik má operacionalizaci s nástrojem.
**Gaps:**
- Volba prahu (např. Q3 ≥ 70 %, P6–P8 ≥ 2/3) je deklarována bez explicitního zdůvodnění literaturou ani kalibrací — proč zrovna 70 %, ne 60 nebo 80?
- E3 je popsána jako „dokončeno + kompakce + restarty", ale v souhrnných tabulkách se objevuje jako jedna hodnota; agregační pravidlo není popsáno.
- LLM-as-judge: rubrika 1–3 je rozumná, ale validace proti lidskému hodnocení (Cohenovo κ) chybí — autor to v limitech přiznává, ale měl by mít alespoň pilotní inter-rater check na 2–3 bězích, jinak P6, P7, P8, Q4, Q8 nejsou důvěryhodné.
- Q4 původně 24bodová rubrika a manuální dopočet AC25 je problematické a měl by být explicitněji zarámován jako post-hoc oprava.
- Q8 jako *minimum* pěti dimenzí je zajímavé designové rozhodnutí, ale silně citlivé na šum jednoho hodnocení; medián nebo vážený průměr by mohly být robustnější — chybí citlivostní úvaha.
- Ablace pouze 2× per varianta — autor sám přiznává, ale design by měl mít alespoň 3 běhy pro minimální výpověd o variabilitě.
- „Embedded single-case design" se opírá o Yin, ale „embedded" subunits zde nejsou jasně definovány (jsou to běhy? iterace?).

### Praktická část (kap. 4)
**Expectation:** Má chronologicky dokumentovat experiment: přípravu, jednotlivé iterace s daty, ablace. Mělo by být jasné, co se dělo, proč a co z toho plyne.
**Reality:** Příprava (specifikace, referenční implementace, baseline AGENTS.md) následovaná pěti pilotními iteracemi r1–r5 a dvěma ablacemi. Každá iterace má tabulku, diagnostiku a změny pro další iteraci. Souhrnná tabulka křížového srovnání.
**Gaps:**
- Referenční implementace dosáhla „mutation score 91,9 %" — to je vyšší než exit kritérium 70 %, ale agent dosahuje max 84 %, často 67–72 %. Je to ok, jen by se hodilo komentovat, proč referenční implementace překračuje práh tak výrazně (důsledky pro nastavení prahu).
- V r4 došlo k změně Docker konfigurace + parametrů modelu (uvedeno až v limitech kap. 5); to je *zásadní* metodologický problém, který by měl být explicitně přiznán už v kap. 4 u r4, ne až post hoc.
- E1 u ablací je „n/a" kvůli chybějícímu transcriptu — to je vážný problém: efektivita je jednou ze tří dimenzí rámce a v ablacích zcela vypadla.
- Q3 v A-2 a r4 = „n/a" — zase ztráta dat ve dvou klíčových bězích.
- Souhrnná tabulka má použité barvy, ale legenda barevné kódování neuvádí (pouze ve výřezu zdroje, ne v textu pro čtenáře).
- Rozdíl mezi „fail" v P metrikách u jednotlivých iterací není vždy jasný — v r5 je P1 „?" a poznámka pod čarou je matoucí (agent „nevytvořil issues" → P1 by mělo být FAIL, ne „?").
- Tvrzení „nedeterminismus modelu je silnějším faktorem než drobné lokální změny" v r5 je silné — opírá se o n=1 srovnání, mělo by být formulováno opatrněji.

### Vyhodnocení a diskuse (kap. 5)
**Expectation:** Má interpretovat výsledky vůči cílům, porovnat s literaturou, přiznat limity, dát doporučení. Žádná nová data, jen syntéza.
**Reality:** Strukturováno podle cílů, pak srovnání s literaturou, pak limity (jak se projevily prakticky), doporučení a další výzkum. Reflexivní pohled je dobrý.
**Gaps:**
- Sekce „Cíl 1" a „Cíl 2" obsahují místy nová pozorování (např. obrázek operacionalizace), která by mohla patřit do kap. 4.
- Závěr kap. 5 mírně relativizuje výsledky („data jsou konzistentní s hypotézou…"), což je správně, ale občas se opakuje stejná opatrnost na třech místech.
- Doporučení pro praxi jsou rozumná, ale „Q5 vzrostl o ~150 %" je nadnesené — z 1 na 3–4 je sice procentuálně velký nárůst, ale absolutně malý a citlivý na šum; lepší formulace „z 1 na 3–4 varování".
- Chybí explicitní reflexe, zda sada 19 metrik nebyla *zbytečně velká* — sám autor přiznává, že 3 nepřinesly rozlišení, ale neformuluje doporučení redukovat sadu pro replikace.
- „Efekt učení autora" je důležitý a dobře přiznaný, ale jako mitigace chybí návrh (např. „mohlo by být replikováno nezávislým experimentátorem").

### Závěr
**Expectation:** Stručná syntéza splnění cílů, hlavní přínos, limity, výhled. Žádné nové informace.
**Reality:** Pokrývá tři cíle, formuluje hlavní přínos (postup + sada metrik), přiznává analytickou generalizaci, dává doporučení pro praxi i akademii. Délka odpovídá BP.
**Gaps:**
- „Kombinace deterministických a kvalitativních metrik přinesla komplementární pohled" — opírá se o Q8, kde sám autor přiznává, že bez κ validace je síla závěru omezená; v závěru by se to mělo přiznat.
- Chybí jednoznačné slovo o tom, *jak velké* zlepšení bylo (kvantitativní shrnutí: r1 4/10 → r3 7/10 — ale závěr to nezmiňuje).

---

## Celkové hodnocení

Práce je obhajitelná a na úrovni výrazně přesahující obvyklou bakalářskou práci po stránce metodologické promyšlenosti, integrace literatury a sebereflektivnosti. Hlavní silou je transparentní iterativní design s ablacemi a poctivá diskuse limitů. Hlavní slabinou je metodologická křehkost závěrů: malý počet běhů, zaměnitelnost změn (instrukce vs. konfigurace v r4), chybějící validace LLM-as-judge a několik mezer v datech (chybějící E1 a Q3 v ablacích) snižují důvěru v ablační závěry. Práce je nadprůměrná, ale potřebuje úpravy v opatrnosti claimů a v konzistenci dat.

---

## Kritické problémy (musí se opravit)

### K1: Změna konfigurace mezi r3 a r4 jako neoznámená proměnná
- **Kde:** kap. 4 (pilot-r4) + kap. 5.3
- **Citace:** kap. 5: „Od r4 byla změněna konfigurace modelu (parametry kontextového okna). Tyto změny jsou potenciálním zavádějícím faktorem: regrese r4 mohla být částečně způsobena změnou konfigurace, ne pouze přidáním dvou řádků do Constraints."
- **Problém:** V kap. 4 je regrese r4 interpretována jako důsledek úpravy instrukcí („pravidlo v Constraints nepomohlo"). Teprve v kap. 5 je odhaleno, že se zároveň měnila konfigurace. To podkopává klíčové tvrzení o „pravidlo vs. verifikační krok".
- **Dopad:** Závěr „deklarativní pravidla jsou slabší než procedurální verifikace" stojí významně na srovnání r3 vs. r4. Pokud se mezi nimi měnily dvě věci, kauzální atribuce není obhajitelná.
- **Řešení:** (a) Explicitně přiznat změnu konfigurace už v kap. 4 u r4. (b) Formulovat závěr o operacionalizačním vzorci jako podpořený *primárně* r2→r3 a r3→r5 (kde konfigurace stabilní), ne r3→r4. (c) Přidat větu do diskuse cíle 2: „Atribuci regrese r4 výhradně instrukcím nelze učinit."

### K2: Chybějící data E1 a Q3 v ablačních bězích
- **Kde:** kap. 4 (tabulky ablace A, B), kap. 5
- **Citace:** „E1 u ablace nelze dopočítat, protože v lokálním snapshotu chybí transcript.json"; „Q3 v A-2 nelze měřit"
- **Problém:** Efektivita (E) je jednou ze tří dimenzí rámce, ale v *žádném* ablačním běhu nemáme E1. Q3 chybí ve dvou ze čtyř ablačních běhů. To znamená, že ablace nedokáží dimenzi E vůbec hodnotit.
- **Dopad:** Závěry typu „verifikační kroky strukturují práci agenta" se opírají o nepřímý proxy (počet vitest spuštění); přímá metrika tokenů chybí. Cíl 3 je tím v dimenzi E nesplněn.
- **Řešení:** (a) Buď doběhnout ablace s funkčním exportem (preferované), (b) nebo explicitně přiznat v kap. 5, že dimenze E v ablacích nebyla měřitelná, a omezit závěry na dimenze P a Q. Sekce „Cíl 3" by toto omezení měla obsahovat.

### K3: LLM-as-judge bez validace, ale Q8 nese netriviální závěr
- **Kde:** kap. 3.2.5, kap. 5.1, kap. 5.4
- **Citace:** „Spolehlivost LLM-as-judge nebyla validována proti lidskému hodnocení (např. Cohenovým κ) z důvodu časových omezení"; „Jedinou z nich, na které stojí netriviální závěr, je Q8"
- **Problém:** Autor v limitech přiznává, ale pak v doporučení a v cíli 3 závěr o „aktivační" funkci instrukcí stojí výhradně na Q8. Není zde alespoň pilotní inter-rater check (např. 5–10 výstupů ohodnocených autorem nezávisle).
- **Dopad:** Ablační závěr o sekci Package Quality („design klesl") je neověřený v jediném důkazu, na kterém závisí.
- **Řešení:** Dvě možnosti: (a) Provést alespoň minimální validaci — autor sám ohodnotí 10–20 artefaktů a spočítá shodu s GLM-5; uvést jako přílohu. (b) Pokud nelze, *výrazně* zeslabit ablační závěr o Package Quality v kap. 5 a v závěru. Současné formulace jsou silnější než opora.

---

## Důležité problémy

### D1: Cíle bez explicitních kritérií úspěchu
- **Kde:** kap. 1.2
- **Citace:** „Na případové studii demonstrovat iterativní postup… a vyhodnotit, zda a jak vede k měřitelným změnám"
- **Problém:** Cíle 2 a 3 nemají kritérium splnění. Kdy je „demonstrace" úspěšná? Kdy je ablace „dostatečná"?
- **Dopad:** Oponent může zpochybnit, zda jsou cíle splněny; vyhodnocení je vždy obhajitelné jako „částečné".
- **Řešení:** Přidat konkrétní kritéria úspěchu (např. „alespoň 50 % zlepšení v deterministických metrikách mezi baseline a finální iterací"; „pro každou ablaci vyhodnotit dopad na alespoň 8 z 19 metrik").

### D2: Q4 a 24-bodová rubrika opravená post-hoc
- **Kde:** kap. 3.2.3, kap. 5.4
- **Citace:** „Historicky uložené judge běhy byly exportovány ve 24bodovém formátu; při finalizaci práce byl chybějící bod AC25 (custom holiday calendar) dopočítán manuálně."
- **Problém:** Manuální dopočet po dokončení experimentu je metodologicky problematické — judge nehodnotil AC25 stejnou rubrikou, autor sám doplnil. To je přímý zásah experimentátora do metriky.
- **Dopad:** Q4 hodnoty (zejména 25/25) jsou zkreslené ve směru autorovy korekce. Oponent na to zaútočí.
- **Řešení:** Buď znovu pustit judge se správnou 25-bodovou rubrikou (preferované), nebo přiznat Q4 jako 24-bodovou metriku s dodatkem o AC25 a *neuvádět* dopočítaná čísla jako splněná exit kritéria.

### D3: Slabá generalizace tvrzení o nedeterminismu
- **Kde:** kap. 4.2.5, kap. 5.1
- **Citace:** „Data tak naznačují, že nedeterminismus modelu je pro dodržování vícekrokových sekvencí silnějším faktorem než drobné lokální změny v pre-PR checklistu."
- **Problém:** Tvrzení vychází z n=3 srovnání (r3, r4, r5) s mnoha confoundery (různé instrukce, změna konfigurace v r4, prompt sensitivity). Chybí opakování stejných instrukcí.
- **Dopad:** Klíčové zjištění práce stojí na metodicky slabém srovnání. Oponent: „Jak víte, že to je nedeterminismus a ne kumulativní efekt změn instrukcí?"
- **Řešení:** Přeformulovat na „Data jsou konzistentní s vysokou variabilitou v dodržování vícekrokového postupu, jejíž zdroj nelze v této studii izolovat (nedeterminismus, prompt sensitivity, kumulace instrukcí)." Přidat to jako námět dalšího výzkumu (sekce 5.5 to částečně dělá).

### D4: Nesoulad „pět iterací" a ablační vzorek 2 běhů
- **Kde:** kap. 3.3.5
- **Citace:** „Každá ablace se provádí ve dvou nezávislých bězích se stejným nastavením, aby bylo možné odlišit systematický efekt změny od přirozené variability"
- **Problém:** Dva běhy nedokáží odlišit systematický efekt od šumu — autor sám přiznává v limitech. Volba 2 běhů není zdůvodněna ekonomicky/časově ani odkazem na praxi.
- **Dopad:** Ablační výsledky mají velmi nízkou statistickou sílu; rozdíl B-1 (37/42) vs. B-2 (11/42) ukazuje rozsah šumu, který přesahuje měřený efekt.
- **Řešení:** Buď zvýšit n na 3 (mediány stabilnější), nebo explicitně zdůvodnit „2 běhy = praktický kompromis při ceně X tokenů a Y minutách per běh", a uvádět výsledky výhradně jako indikativní.

### D5: Úvod kap. 1 obsahuje silné claimy bez hedge
- **Kde:** kap. 1.1
- **Citace:** „Lulla et al. zjistili, že přítomnost instrukčního souboru je spojena se zkrácením doby běhu o 28,6 %"
- **Problém:** Číslo prezentováno bez kontextu (medián, konkrétní vzorek 124 PR, 10 repozitářů). Čtenář dostane dojem o robustním efektu.
- **Dopad:** Drobné, ale opakuje se — vytváří dojem silnější opory než ve skutečnosti.
- **Řešení:** Doplnit „v jejich vzorku 124 PR" nebo „mediánové zkrácení", aby čtenář viděl rozsah evidence.

### D6: Sekce „Praktiky podporující udržovatelnost" je velmi krátká
- **Kde:** kap. 2.1.2
- **Citace:** Celá podsekce má cca 10 řádků a opírá se převážně o McConnella + jednu citaci SWEBOK.
- **Problém:** Disproporční vůči ostatním podsekcím; udržovatelnost je přitom jedna ze dvou klíčových charakteristik vybraných z ISO 25010 a má v práci samostatné metriky (Q5–Q8).
- **Dopad:** Slabší teoretická opora pro 4 metriky.
- **Řešení:** Rozšířit o moderní zdroje (Martin — Clean Code, Fowler — Refactoring, případně novější studie o code smells).

### D7: Tabulka přehledu metrik je formátovacím způsobem rozbitá
- **Kde:** kap. 3.4
- **Citace:** Sloupec „Exit kritérium" obsahuje „pass", „splněno", „match", „42/42" — různé jednotky pro stejnou kategorii.
- **Problém:** Notace není konzistentní; čtenář musí dešifrovat.
- **Dopad:** Snižuje čitelnost klíčové reference, kterou bude oponent listovat.
- **Řešení:** Sjednotit notaci (např. všechny binární metriky „pass/fail", všechny prahové „≥ X").

### D8: Tvrzení o kauzalitě self-recognition → self-preference
- **Kde:** kap. 2.2.3, kap. 3.2.5
- **Citace:** „Panickssery et al. prokázali korelaci mezi schopností modelu rozpoznat vlastní výstupy a mírou, do jaké je preferuje, což naznačuje kauzální vztah"
- **Problém:** Sám autor používá „naznačuje kauzální vztah", ale o kus dál v kap. 3 píše „self-preference bias" jako fakt vyžadující mitigaci. Nejednotná míra opatrnosti.
- **Dopad:** Drobné — ovlivňuje volbu judge modelu, ale obhajitelné.
- **Řešení:** Sjednotit formulaci v obou sekcích.

---

## Drobné problémy

### N1: Opakování v kap. 1 a kap. 2
Tříbodové rozlišení Lulla vs. Gloaguen vs. Li je v úvodu i v kap. 2.2.3. Doporučuji v úvodu zkrátit, v kap. 2 ponechat plnou syntézu.

### N2: Pojem „špička promptu na krok" v E1
Termín „špička" je hovorový. Nahradit „maximum vstupních tokenů na jeden krok".

### N3: Inkonzistentní použití OK/FAIL vs. ✓/✗
V tabulkách souhrnných výsledků je v exportu vidět směs. Sjednotit.

### N4: „Q5 vzrostl o ~150 %"
Nadnesené pro absolutní hodnoty 1 → 3–4. Lépe „z 1 na 3–4 lint warnings".

### N5: Citace ve scope (kap. 1.3) referencují kap. 3 dopředu
Forward-reference je v pořádku, ale zde by stačilo říct „viz dále" bez konkrétního labelu.

### N6: V závěru chybí konkrétní číselné shrnutí
„Měřitelné zlepšení" — ale jaké? Doplnit „r1: 4/10 → r3: 7/10 deterministických kritérií".

### N7: Použití „autor" v 3. osobě
V některých sekcích autorský odstup, jinde 1. os. plurálu („pouštíme", „necháváme"). Sjednotit.

### N8: „Tichá ukončení nástroje" jako limit
Důležité pro reprodukovatelnost — patřilo by zmínit i ve scriptu/přílohách, kde popsáno řešení (opakování běhu).

### N9: Hodnocení Q8 jako „minimum"
Designové rozhodnutí dobré, ale chybí citace metodologického základu (např. „weakest-link aggregation").

### N10: V odkazech na sekce „[ref:sec:...]"
Vzhledem k tomu, že jde o LaTeX export, prošlo to v pořádku; v hotové práci ověřit, že všechny odkazy se rozparsovaly.

---

## Konzistence a terminologie

| Pojem/zkratka | Problém | Kde se vyskytuje | Návrh |
|---------------|---------|------------------|-------|
| AGENTS.md vs. CLAUDE.md | Úvod uvádí oba, dále už jen AGENTS.md | úvod, kap. 2.2.2 | V úvodu zmínit, že práce dále používá AGENTS.md, a proč. |
| pilotní fáze vs. pilotní iterace | Jednou „fáze", jindy „iterace" | kap. 3, 4 | Sjednotit: „pilotní fáze" (celý blok r1–r5), „iterace" (jeden cyklus). |
| baseline | Vícevýznamové: baseline instrukce vs. baseline běh r1 vs. baseline r3 pro ablace | kap. 3, 4, 5 | Specifikovat: „baseline instrukce", „baseline run", „ablation baseline". |
| „qual" / „det" / „zaz" | Zkratky používané v textu | kap. 3 a 5 | Buď psát plně, nebo zavést tabulku zkratek. |
| Stryker mutation testing | Konfigurace popsána u Q3, ale verze nástroje není uvedena | kap. 3.2.2 | Doplnit verzi pro reprodukovatelnost. |
| OpenCode | Zmíněn jako nástroj, ale není definován | kap. 3.3.2, 4 | První výskyt: krátká definice (CLI agent framework). |
| analytická generalizace (Yin) | Použito správně, ale 3× v různých sekcích | kap. 1.3, 3.5, závěr | Definovat jednou, dál jen odkazovat. |

---

## Chybějící nebo slabé reference

| Místo v textu | Co chybí | Návrh zdroje |
|---------------|----------|--------------|
| Kap. 2.1.2 (udržovatelnost) | Moderní zdroje k code smells, refactoring | Fowler 2018 (Refactoring 2nd ed.); Martin 2008 (Clean Code) |
| Kap. 3.2.2 (Q3 práh 70 %) | Empirická opora pro práh | Just et al. 2014 — mutation operator effectiveness; nebo Petrović & Ivanković 2018 (Google) |
| Kap. 3.2.3 (Q8 jako minimum) | Zdroj pro weakest-link aggregation | Saaty (AHP) nebo bezpečnostní literatura |
| Kap. 3.5 (LLM-as-judge bez κ) | Standardní postupy validace | Cohen 1960; novější Liu et al. 2023 (G-Eval) |
| Kap. 5.4 (kontrolované vs. reálné podmínky) | Studie o rozdílu lab vs. field experimentů v SE | Sjøberg et al. 2005 |
| Kap. 5.5 (expertise reversal effect) | Zmíněno bez citace | Kalyuga et al. 2003 |
| Kap. 4.1.3 (Mao et al. — pořadí komponent) | Použito jako základ pro AGENTS.md, ale aplikace zjednodušená | Doplnit zdůvodnění, proč právě 7 komponent z Mao a které vynechány |

---

## Silné stránky

1. **Sebereflexivní limity** — sekce 5.4 explicitně rozebírá, jak se předem deklarovaná omezení v praxi projevila („Změny konfigurace mezi běhy", „Tiché ukončení nástroje", „Efekt učení autora"). Citace: „Autor se v průběhu iterací učil diagnostikovat selhání a formulovat opravy. Tento efekt nelze od efektu instrukcí oddělit." — to je úroveň reflexe nadprůměrná i pro magisterské práce.

2. **Operacionalizace metrik** — každá z 19 metrik má jasně určený nástroj, vstup, výstup. Příklad P3: „počet větví, kde první zápis do src/ předcházel prvnímu zápisu do tests/ (tddOrderViolations)". Reprodukovatelnost je vysoká.

3. **Vzorec operacionalizace** — pravidlo → příkaz → verifikační krok je nový, použitelný a opřený o data ze tří nezávislých opatření. Citace: „r4 řešilo dosud neadresovaný problém Q2 přidáním pravidla do Constraints… Výsledek byl regrese." — vzorec je empiricky podložen.

4. **Vědomí self-preference biasu** — explicitní volba judge modelu z jiné rodiny (GLM-5 vs. MiniMax-M2.5). Mnoho prací s LLM-as-judge tuto volbu nereflektuje.

5. **Případová studie reálně do hloubky** — devět běhů, transcript analýza, behaviorální popis. Není to typická BP „udělal jsem 3 experimenty a šmytec".

6. **Integrace literatury** — kap. 2.2 (AI agenti) syntetizuje převážně 2024–2026 zdroje, vidí mezery a buduje argumentaci pro vlastní rámec, ne jen lineární přehled.

---

## Souhrnná tabulka

| Dimenze | Hodnocení (1-3) | Hlavní problém |
|---------|----------------|----------------|
| Metodologie | 2 | r3→r4 confounding (konfigurace), 2 běhy v ablacích, chybějící κ pro judge |
| Argumentace | 2 | Místy silnější claimy, než opora unese (D3, D8); ale dobře hedgeované |
| Konzistence | 2 | Drobné nesoulady v terminologii (baseline, fáze/iterace), formátování tabulek |
| Literatura | 3 | Solidní syntéza, aktuální zdroje; menší mezery v udržovatelnosti |
| Struktura | 3 | Logická návaznost, dobré signposty, přiměřené proporce |
| Síla tvrzení | 2 | Většinou ok, ale ablační závěry zaostávají za uplatněnou opatrností v limitech |
| Úplnost | 2 | Cíle pokryty, ale chybí E v ablacích (K2) a Q4 post-hoc (D2) |
| Prezentace | 2 | Tabulky barevné, ale legenda chybí; několik formátovacích inkonzistencí |

---

## Doporučení pro obhajobu

Oponent pravděpodobně napadne:

1. **„Jak víte, že regrese r4 byla způsobena instrukcí, a ne změnou konfigurace?"** (K1) — Připravte si odpověď: priznejte, že nelze; argumentujte vzorcem operacionalizace na r2→r3 a r3→r5. Mějte připravenou tabulku, co všechno se mezi r3 a r4 měnilo.

2. **„LLM-as-judge bez κ — jak důvěryhodné jsou Q4, Q6, Q7, Q8?"** (K3) — Nabídněte buď příslib pilotní κ validace v dalším výzkumu, nebo (lépe) ji proveďte před obhajobou na 10–20 vzorcích.

3. **„Dva běhy per ablace — jak se z toho dá něco usuzovat?"** (D4) — Mějte připravený rozsah variability mezi B-1 a B-2 (37 vs. 11 v Q2), to ukazuje pochopení limitů. Prezentujte ablační výsledky výhradně jako indikativní.

4. **„Q4 byla post-hoc opravena — neovlivňuje to závěry?"** (D2) — Připravte přepočet bez AC25 a ukažte, že kvalitativní závěry se nemění.

5. **„Sada 19 metrik je pro BP velká — proč jste neredukoval?"** — Argumentujte, že redukce by mohla skrýt komplementaritu (Q2 vs. Q3 v B-2 ukazuje, že redundance je tu zdánlivá). Nicméně připusťte, že 3 metriky (Q1, Q6, E3) na této úloze neměly rozlišení.

6. **„Co kdyby experiment provedl někdo jiný? Reprodukovala by se zjištění?"** — Skripty veřejné, instrukce verzované, baseline dokumentováno. Riziko: efekt učení autora v diagnostické fázi (přiznáno v 5.4).