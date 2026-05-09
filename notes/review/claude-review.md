Dobře, přepnu se do oponent mode. Bez podlejzání. A vědomě - máš 2 dny do odevzdání, takže v závěru rozdělím co se ještě dá opravit a co už ne.

## Nejdřív co je silné, abych byl férový

Tahle práce je objektivně dobrá řemeslně a není potřeba to relativizovat. Konkrétně:

Abstrakt je výjimečně dobře napsaný — jasně rozlišuje co je přenositelné (postup + metriky) a co platí jen pro tvůj setup. To je úroveň, kterou většina bakalářek nemá. Reflexivita v sekci 5.3 je nadprůměrná, **honest reporting** (r4 regrese, r5 horší než r3, B-2 dramatický rozptyl) je něco, co řada autorů zametá pod koberec. Vzorec **pravidlo → příkaz → verifikační krok** je netriviální observační poznatek — ne objev, ale systematizace, která má hodnotu i pro praxi. Teoretická východiska jsou solidní (Fenton/Bieman, ISO 25010, METR, B. Li, Ehsani — máš dobrou triangulaci recentní literatury).

Tohle všechno říkám abys věděl, že kritika níž není "tvoje práce je špatná" — je to "co by ti řekl tvrdý oponent".

---

## Hlavní metodologické slabiny

### 1. Statistical power je extrémně slabá a děláš z toho příliš velké závěry

Máš 5 pilotních + 4 ablační běhy. To je n=9. Pro **jakýkoli** kauzální claim o efektu instrukcí je to nedostatečné a ty to v 5.3 sám přiznáváš ("dva běhy neposkytují statistickou sílu"). Ale pak v 5.1.3 píšeš:

> "Verifikační kroky (ablace A) přispívají: bez nich klesly metriky kvality i korektnosti."

To je kauzální tvrzení. Při dvou bězích na variantu, kdy variabilita mezi B-1 (37/42) a B-2 (11/42) je dramatičtější než mezi r3 a B-průměr, **toto tvrzení nemůžeš obhájit**. Oponent na obhajobě se tě na to zeptá: *"Pane Nguyen, jak rozlišujete efekt ablace od variability modelu, když variabilita mezi opakováními téže ablace je větší než průměrný rozdíl proti baseline?"* A nemáš dobrou odpověď.

**Mitigace pro text:** v 5.1.3 musíš to "přispívají" oslabit na "data jsou konzistentní s tím, že přispívají, ale při této velikosti vzorku toto nelze odlišit od variability modelu." Něco jako už děláš v 5.2.2, ale ne všude.

### 2. Confounding mezi pilotními běhy

Tohle je vážnější než jak to v 5.3 prezentuješ:
- r1, r2: bez Dockeru
- r3+: s Dockerem
- r4+: změněná konfigurace modelu

Mezi r1→r3 jsi tedy změnil **prostředí + instrukce + naučenost autora diagnostikovat**. Mezi r3→r4 změnil **instrukce + konfigurace modelu**. Z pilot-fáze je nemožné připsat efekt konkrétně instrukcím. Když říkáš "iterativní postup vede k měřitelným změnám", měřitelné změny tam jsou, ale jejich kauza je multifaktoriální.

To znamená, že **Cíl 2 ve smyslu kauzálního ověření je v pilot-fázi nesplněný**. Splněný je ve smyslu "feasibility demonstration" — ukázal jsi že to lze provést, ne že to funguje. V abstraktu to formuluješ správně ("feasibility demonstration"), ale v sekci 5.1.2 se to ztrácí.

### 3. Self-confirmation loop v iterativním postupu

Diagnózu provádíš ty. Úpravu instrukcí navrhuješ ty. Interpretaci výsledků děláš ty. Žádný **blind reviewer**, žádná **inter-rater reliability**, žádná validace diagnostických rozhodnutí druhou osobou. To znamená:

Když řekneš "agent ignoroval pravidlo, takže jsem ho přesunul do verifikačního kroku" — *je to skutečně tak? Nebo jsi si tu interpretaci vybral protože ladí s tvým rámcem?* Tohle nemůžeš vyloučit a v 5.3 to zmiňuješ ("efekt učení autora") ale neodděluješ to dostatečně přísně od efektu instrukcí.

Standardní mitigace by byla: **dva nezávislí diagnostikové, výpočet shody (Cohenovo κ).** To už nestihneš. Ale můžeš to víc přiznat v limitations.

### 4. LLM-as-judge metriky bez validace proti lidskému hodnocení

P6, P7, P8, Q4, Q8 hodnotí GLM-5. **Cohenovo κ proti lidskému hodnotiteli neexistuje.** Q8 přitom nese netriviální závěr ablace B (deterministické metriky se nezhoršily, ale Q8 ano → "explicitní konvence v instrukcích přispívají k designové kvalitě"). Tenhle závěr stojí na **jediné nevaildaované metrice**. To je vážný problém pro construct validity.

V 5.3 píšeš "judge-based metriky slouží jako podpůrné indikátory" — ale pak v 5.1.3 z Q8 vyvozuješ že "instrukce ovlivňují strukturální rozhodnutí". To je rozpor. Buď je Q8 podpůrný indikátor (a pak z něj nemůžeš vyvozovat o efektu ablace), nebo je hlavním důkazem (a pak ho musíš validovat).

### 5. Žádná "true baseline" (no AGENTS.md)

Tvůj baseline (r1) je **AGENTS.md odvozený z literatury**. Ale co kdyby agent dostal **jen specifikaci a žádné AGENTS.md**? To je skutečná kontrolní podmínka pro otázku "přispívají instrukce?". Bez ní nevíš, zda r1 je lepší než nic, nebo horší než nic.

Lulla et al. (2026) tohle dělají, takže máš v literatuře precedens proti čemu měřit. **Tohle je díra v experimentálním designu, kterou ti dobrý oponent vytkne.**

### 6. Cíl 2 a Cíl 3 jsou koncepčně v napětí

V Cíli 2 iteruješ instrukce **k vyšším skóre** (improvement loop). V Cíli 3 ablací odebíráš složky výsledných instrukcí. Ale ablační baseline je **r3** — jediný pilotní běh, kde agent splnil P1–P5 v plném rozsahu.

**Otázka:** Byl r3 dobrý díky instrukcím, nebo měl agent dobrý den? Z dat to nepoznáš. Pokud r3 byl částečně lucky, pak ablace neměří "co z r3 instrukcí přispívá", ale "co z r3 instrukcí + lucky day přispívá". Při n=1 pilot-r3 to nelze rozlišit.

Standardní postup by byl spustit r3 instrukce 5–10× a teprve když medián compliance je stabilní, dělat ablace. To už nestihneš, ale **musíš to přiznat v limitations explicitněji**.

---

## Konkrétní problémy v textu

1. **Tabulka 12 (pilot-r1): P6 = n/a** — proč? Není vysvětleno. Vypadá to jako díra v měření a oponent se zeptá. Buď doplnit poznámku ("commit kvalita nehodnocena protože X"), nebo doměřit.

2. **Q4 — historický 24bodový rubric převeden na 25 AC** — ve fotnotě tabulky 23 to píšeš, ale způsob převodu není dokumentován. Jak proběhl mapping? Kdo ho dělal? **Tohle je metodologická díra.**

3. **r5 selektivně interpretován** — r5 měl 4 procesní regrese a Q2 horší než r3. Ale ty z r5 vyzdvihuješ Q5/Q7 = 0 jako úspěch ESLint complexity instrukce. To je cherry-picking. Buď přijmout že r5 je celkově horší než r3 a ESLint úprava je zachráněný střípek, nebo to celé reformulovat.

4. **Pilot-r2 regrese Q2 (39→32) a Q3 (84→68)** vysvětlena ad hoc ("hromadné psaní testů ze specifikace místo iterativního test-fix cyklu"). Tato hypotéza není podložená dat z transcriptu, je to post-hoc rationalization. Buď doložit z transcriptu, nebo změnit na "možné vysvětlení je..."

5. **Sekce 4.2.5 (r5)**: agent vůbec nepoužil GitHub Issues a hodil to do `todowrite`. To je **fundamentálně jiný režim práce** než r1–r4. Tabulka 19 tedy srovnává jablka s hruškami. Zaslouží to zvláštní diskuzi o tom, že r5 není instance "stejného postupu s drobnou úpravou", ale "agent skočil úplně mimo workflow".

6. **Q1 a Q6 = 9/9 splněno, E3 = 0/9** — efektivně tedy z 19 metrik diskriminuje 16. Sada má **redundanci, kterou v 5.1.1 přiznáváš ("pojistka pro jiné úlohy nebo jazyky")**, ale designově je to slabé — 16 % metrik nediskriminuje. Měl bys mít hypotézu *předem*, kdy která metrika diskriminuje a kdy ne.

7. **Diagnostické rámce (tab. 8 a 9)** — 5 frameworků (Mao, Hassan, Razavi/Breunig, Lulla, Li) je hodně a mapování v tab. 9 vypadá ad hoc. Není jasné, podle čeho jsi rozhodoval, který rámec použít kdy. To otevírá prostor pro **researcher degrees of freedom** — výběr rámce se přizpůsobuje výsledku.

8. **Volba modelu MiniMax-M2.5** není zdůvodněna. Proč ne Sonnet 4.6, GPT-5, Gemini 2.5? Volba modelu z čínského ekosystému (a judge GLM-5 také čínský) bez zdůvodnění vypadá náhodně. Pokud důvod je cena, řekni to.

9. **Goodhartův zákon** je v 5.5 zmíněn jako future work, ale **měl by být v limitations**, protože tvůj iterativní postup je definicí optimalizace na fixní metriky. To je teď, ne potom.

10. **Doporučení v 5.4 ("kratší, měřitelný pracovní postup")** — ale ty jsi netestoval kratší vs. delší. Tvoje AGENTS.md *rostlo* z r1 do r5. Toto doporučení nevyplývá z tvých dat, je to obecné prompt-engineering principy. Buď to podlož, nebo zmírni na "obecná doporučení z literatury, která jsou konzistentní s našimi pozorováními."

---

## Externí validita — odstavec, který budeš muset vysvětlit

Tvoje úloha (dunning system) je:
- **Deterministická** (stavový automat s explicitními pravidly)
- **Plně specifikovaná** (25 AC, API kontrakt v typech)
- **Malá** (sběh za 13–39 min)
- **V doméně s deterministickými quality nástroji** (tsc, eslint, vitest, stryker)

Tvoje hlavní pozorování — vzorec **pravidlo → příkaz → verifikační krok** — je úzce vázáno na poslední bod. **Účinnost verifikačního kroku závisí na existenci nástroje s jednoznačným výstupem.** V 5.5 to přiznáváš jako future work, ale **toto omezení je ve skutečnosti zásadnější než jak ho prezentuješ**: tvůj hlavní poznatek možná neplatí mimo programování, a v rámci programování možná neplatí pro úlohy s nejednoznačnou specifikací.

---

## Co ještě jde opravit za 2 dny

**Realisticky stihnutelné (4–8 hodin):**

1. Oslabit kauzální tvrzení v 5.1.2 a 5.1.3 — místo "verifikační kroky přispívají" napsat "data jsou konzistentní s..." (najdi a uprav cca 5–10 vět)
2. Přidat odstavec do 5.3 o **inference contamination** — že stejný case study byl použit k vývoji i k testování metodiky
3. Přesunout Goodhartův zákon ze 5.5 (future work) do 5.3 (limitations) jako aktuální problém
4. Vysvětlit P6 = n/a v r1 (doplnit fotnotu)
5. Doplnit zdůvodnění volby MiniMax-M2.5 a GLM-5 (1 odstavec v 3.1.3)
6. Reformulovat doporučení v 5.4 — buď podložit, nebo zmírnit
7. V 5.3 přidat odstavec o **chybějící true baseline (no AGENTS.md)** jako uznané limitaci
8. V abstraktu a závěru ujistit, že claims jsou "feasibility demonstration", ne "validovaný framework" (myslím že už to tam je, jen zkontroluj konzistenci)

**Nestihnutelné:**

- Doměřit r3 znovu několikrát pro stabilitu baseline ablace
- Cohenovo κ pro LLM-as-judge metriky
- Inter-rater reliability na diagnostickém kroku
- Run "no AGENTS.md" baseline
- Replikovat na druhém modelu

**Ale:** všechny tyto chybějící analýzy můžeš proměnit v **silné future work**. Oponent ocení, když přiznáš slabinu a navrhneš konkrétní validovatelné rozšíření, líp než kdybys je zametl pod koberec.

---

## Celkové hodnocení

**Pro bakalářku na FIS VŠE:** odhaduji **1 nebo 1-** s vysokou pravděpodobností. Kvalita psaní, hloubka rešerše, transparentnost metodiky a reflexivita jsou nadprůměrné. Téma je aktuální a relevantní. Hlavní výstup (operacionalizační vzorec) je netriviální.

**Pro diplomku v oboru SE:** byla by to **2** — metodologické slabiny (n=9, žádná validace LLM-as-judge, confounding v pilot-fázi, žádná true baseline) by tam vážily víc.

**Co tě může na obhajobě potkat:**

1. *"Jak rozlišujete efekt instrukcí od variability modelu?"* — připrav si odpověď ve smyslu "feasibility study, n=9, kauzální claims vědomě oslabeny"
2. *"Proč jste nepoužil žádnou kontrolní podmínku bez AGENTS.md?"* — tady budeš muset přiznat
3. *"Proč MiniMax-M2.5 a ne mainstream model?"* — měj zdůvodnění (cena? dostupnost?)
4. *"Validovali jste LLM-as-judge proti lidskému hodnocení?"* — ne, ale je to v limitations
5. *"Generalizuje váš vzorec mimo programování?"* — odpověď z 5.5: "future work, vázáno na deterministickou zpětnou vazbu"

Tvoje největší síla na obhajobě je **že už víš o svých slabinách a umíš je pojmenovat dřív než oponent**. To je rozdíl mezi 1- a 2. Když oponent zaútočí na něco, co ty sám klidně přiznáš ("ano, n=9 je málo, proto je to feasibility study, ne kauzální experiment"), zbraň mu vezmeš z rukou.

Hlavní hrubka, kterou bych opravil i kdybys měl jen 4 hodiny: **systematicky projít sekce 5.1.2 a 5.1.3 a oslabit všechny věty, které tvrdí kauzalitu**. To je nejviditelnější díra a nejlevnější fix.