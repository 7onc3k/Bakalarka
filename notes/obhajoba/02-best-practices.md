# Obhajoba BP — best practices a inspirace

> Sebráno: 2026-05-07. Cíl: použitelný referenční dokument pro přípravu obhajoby
> BP na FIS VŠE 2026. Téma BP: metriky a instrukce pro AI coding agenty,
> case study dunning system. Student je vývojář, ne akademik.

## 1. Co komise od obhajoby očekává

Komise BP na české technické fakultě má **konkrétní procedurální očekávání**,
ne TED talk:

1. **Krátké představení práce studentem** (zpravidla 5–7 min na bakaláři, na
   FIS bývá tolerováno 10 min — ověřit u sekretariátu katedry před obhajobou).
2. **Přečtení nebo shrnutí posudků** (vedoucí + oponent). Posudky často
   obsahují explicitní otázky — komise očekává, že na ně máš připravenou
   odpověď v písemné podobě, ne improvizaci ([UISK FF UK](https://uisk.ff.cuni.cz/cs/studium/zaverecne-prace-bc-mgr/zpracovani-prace-a-jeji-obhajoba/),
   [UPOL psych](https://psych.upol.cz/fileadmin/userdata/FF/katedry/pch/studentum/Studium/2.2._Prubeh_obhajob_a_SZZK_na_Katedre_psychologie_prezencni_a_online_formou_01.pdf)).
3. **Reakce studenta na výhrady z posudků** v pořadí, v jakém zazněly.
4. **Diskuse s komisí** — otázky často míří na *budoucí směr* ("kam by se to
   dalo rozvinout?") a *nejzajímavější zjištění*, ne na to, co už je v textu.

Komisi typicky zajímají tři věci ([Diplomka24](https://www.diplomka24.cz/cz/diplomkanaprvnidobrou/jak-pripravit-prezentaci-k-obhajobe),
[ProStudent](https://www.odborne-prace.cz/blog/obhajoba-bakalarske-prace)):

- **Cíl práce** — uměl jsi ho jasně formulovat?
- **Přidaná hodnota** — co je nového, co je tvoje, jaký je dopad do praxe?
- **Metoda** — proč zrovna takhle, a unesl by tvůj postup replikaci?

Komise neočekává, že znáš úplně všechno. Očekává, že **rozumíš svojí vlastní
práci do hloubky** a že **umíš myslet jako výzkumník** — zaargumentovat
omezení, alternativy, generalizovatelnost.

**Specifikum této BP:** práce má dvojí publikum (technické metriky pro AI
agenty + byznys case study dunning). Komise FIS bude mít pravděpodobně mix:
někdo rozumí AI/ML, někdo softwarovému inženýrství, někdo byznys aspektům.
Prezentace musí stát i pro člověka, který *neviděl* current AI engineering
diskurz. Žádné implicitní "víte, jak to chodí s LLM agenty".

## 2. Narativní arc na 10–15 minut

České zdroje doporučují **5–7 min pro BP**, max 10–12 ([tatulda.cz](https://tatulda.cz/priprava-prezentace-k-obhajobe-prace/)).
Anglické zdroje pro 10 min mluví o ~10 slidech, "1 min per slide"
([Mernst guide](https://homes.cs.washington.edu/~mernst/advice/giving-talk.html)).
Pro 10–12 min cíl: **8–12 slidů s reálným obsahem** + titulní + závěrečný.

Doporučená struktura (time allocation pro 12 min):

| Blok | Čas | Obsah |
|------|-----|-------|
| Hook + problém | 1 min | 1 slide: konkrétní situace, ne "AI je důležitá" |
| Cíle + výzkumná otázka | 1 min | 1 slide: 3 cíle BP, jasně očíslované |
| Metoda (v kostce) | 2 min | 1–2 slide: case study + měřicí rámec, ne celá kap03 |
| Klíčový výsledek 1 — metriky | 2 min | 1–2 slide: P/Q/E rámec + příklad |
| Klíčový výsledek 2 — iterace | 2 min | 1–2 slide: jedna iterace s before/after čísly |
| Klíčový výsledek 3 — ablace | 2 min | 1 slide: která složka instrukcí přispívá |
| Limity + generalizace | 1 min | 1 slide: feasibility ne validace, jeden model, jeden projekt |
| Závěr + příspěvek | 1 min | 1 slide: 3 body co je hotovo, co je vlastní |
| **Reserve / Q&A bridge** | — | 1 backup slide se schématem celého rámce |

**Alternativa "3-act":**
1. **Setup** (3 min): co dělají AI agenti, proč je to problém měřit, případová studie.
2. **Confrontation** (6 min): co jsme měřili, jak to vypadalo, co se ukázalo.
3. **Resolution** (3 min): co z toho přenositelné, limity, kam dál.

Tahle struktura funguje líp, když chceš mít narativ. Tabulková struktura
funguje líp, když si chceš jistit, že nic nezapomeneš. **Pro první obhajobu
v životě doporučuji tabulkovou** — v stresu se snáz drží.

**Co NEdělat:**
- Nedávej outline slide ("Today I will talk about…") jako druhý slide. Začni
  problémem ([Mernst](https://homes.cs.washington.edu/~mernst/advice/giving-talk.html)).
- Nepouštěj se do recapu literatury (kap02). Komise to četla. Jednou větou.
- Neopakuj v prezentaci celou metodiku — stačí "měřili jsme proces, kvalitu
  kódu a efektivitu; detail je v kap03".

## 3. Jak otevřít a uzavřít

### První 60 sekund

Nejdůležitější část prezentace. Komise si v ní udělá kotvu, na které visí
zbytek. Proven hooks pro technický talk
([Moxie Institute](https://www.moxieinstitute.com/how-to-open-a-speech-60-seconds/),
[Genard Method](https://www.genardmethod.com/blog/bid/169811/how-to-begin-a-presentation-the-critical-first-60-seconds)):

1. **Konkrétní scéna z reality projektu** — "Když jsem začínal pracovat na
   dunning systému s Claudem, agent v jedné iteraci napsal 600 řádků kódu,
   z nichž 400 bylo duplikace. Bez metrik bych si toho nevšiml."
2. **Statistika, která překvapí** — pokud máš jednu, použij ji. Třeba kolik
   procent kódu agent vyprodukoval, nebo kolik iterací bylo potřeba.
3. **Otázka, na kterou má odpověď celá prezentace** — "Jak poznat, že nový
   AGENTS.md soubor agenta opravdu zlepšil, a ne jen zdánlivě?"

**Anti-pattern:** "Dobrý den, jmenuji se Tony, a dnes vám představím svoji
bakalářskou práci na téma…" Komise to ví. Šetři tím čas.

**Doporučení (ne všichni se shodnou):** některé české zdroje
([Diplomka24](https://www.diplomka24.cz/cz/diplomkanaprvnidobrou/jak-pripravit-prezentaci-k-obhajobe))
říkají začít formálně názvem, jménem a vedoucím. AI eng conf style říká
"hook first, credentials second". **Kompromis:** titulní slide má jméno a
vedoucího (komise vidí), ty mluvenou řečí začneš hookem. Formality jsou na
slidu, energie je v hlasu.

### Posledních 60 sekund

Závěrečný slide musí **zůstat na plátně po celou Q&A** — komise se k němu
vrací ([Mernst](https://homes.cs.washington.edu/~mernst/advice/giving-talk.html)).
Co tam musí být:

- 3 body **co práce přináší** (metriky / postup / ablace)
- 1 věta o **limitu** (jeden model, jeden projekt — feasibility)
- **Žádné "Děkuji za pozornost"** jako jediný obsah slidu — to je promarněné
  místo. Poděkování řekni ústně, slide nech informativní.

Tento slide je tvoje záchranná síť pro Q&A: když se ztratíš, ukážeš na
něj — "to spadá pod druhý cíl, viz tady".

## 4. Slide design pro obhajobu

Pravidla shrnutá z [Mernst](https://homes.cs.washington.edu/~mernst/advice/giving-talk.html),
[MIT CommLab](https://mitcommlab.mit.edu/meche/commkit/technical-presentation/),
[PLOS Ten Simple Rules](https://pmc.ncbi.nlm.nih.gov/articles/PMC8638955/):

**Hard rules:**

- **1 claim per slide.** Když chceš říct dvě věci, jsou to dva slidy.
- **Title je věta s tvrzením**, ne nadpis. Místo "Výsledky ablace" napiš
  "Příkladová sekce instrukcí má největší dopad".
- **3 řádky textu na bullet je už moc**, 2 řádky je často moc. Sans-serif
  font, čitelné z 5 m.
- **Bílé pozadí, černý text.** Žádné transition efekty, žádné loga na
  každém slidu, žádné decorative elements.
- **Žádné "table of contents" slidy.** Ztrácíš na nich čas a strukturu si
  publikum udrží i bez nich, pokud je text dobře navazuje.

**Co tam dát místo textu:**

- **Čísla.** Místo "agent psal hodně duplikátního kódu" napiš "27 % LOC
  bylo duplikace v iteraci 2".
- **Diagram pipeliny.** Schéma "instrukce → agent → kód → metriky" je
  cennější než tři odrážky.
- **Před/po graf.** Iterace 1 vs iterace 5 ve dvou sloupcích vedle sebe.
- **Screenshot reálného artefaktu** — kus AGENTS.md, ukázka findings
  tabulky z kap04. Komise vidí, že to existuje, ne jen že o tom mluvíš.

**Specifikum BP:**

- **Nepoužívej P1/Q3/E1 kódy v prezentaci.** Jsou to interní zkratky.
  V prose: "metrika kompakce kódu" + případně v závorce kód, pokud je to
  v slajdu odkaz na text práce.
- **Nepiš ručně bare metriky.** V thesis máš `\acro` makra — v slidech ne,
  ale princip stejný: jeden termín konzistentně.

## 5. Q&A příprava

### Anticipace otázek

**Step 1: Přečíst si oba posudky podruhé** den před obhajobou.
Vypsat **explicitně otázky z nich** + svoje odpovědi v písemné podobě
(papír, ne v hlavě) ([UISK FF UK](https://uisk.ff.cuni.cz/cs/studium/zaverecne-prace-bc-mgr/zpracovani-prace-a-jeji-obhajoba/)).

**Step 2: Připravit odpovědi na typické "BP defense" otázky**
([BeMo 40 Questions](https://bemoacademicconsulting.com/blog/thesis-defense-questions),
[ServiceScape 17 questions](https://www.servicescape.com/blog/17-thesis-defense-questions-and-how-to-answer-them)).
Pro tuhle BP konkrétně:

- "Proč právě tyto metriky? Co jste vyřadil?" (P/Q/E volba)
- "Jak víte, že to není overfitting na jeden projekt?" (jeden case study)
- "Proč Claude / OpenCode a ne jiný model / harness?"
- "Kdyby měl někdo z firmy převzít váš postup, co konkrétně by udělal?"
- "Proč to není DSR / co to vlastně metodologicky je?" (Yin case study)
- "Jaký je rozdíl mezi metrikou a indikátorem ve vaší práci?" (E3 reframe)
- "Co byste dělal jinak?"
- "Co je nejslabší místo práce?" — připrav si **upřímnou odpověď**, komise
  ocení sebereflexi víc než obhajobu zjevné slabiny.

**Step 3: Připravit jednovětou esenci každé kapitoly.** Pokud se komise
zeptá "co je v kap04?", musíš odpovědět za 10 sekund.

### Jak odpovídat

Best practice z více zdrojů:

1. **Repeat / paraphrase otázky** ([Mernst](https://homes.cs.washington.edu/~mernst/advice/giving-talk.html)).
   Získáš čas a ověříš, že rozumíš. "Pokud jsem otázku pochopil správně,
   ptáte se na…"
2. **Pauza je v pořádku.** 3 vteřiny ticha vypadají dramaticky pro tebe,
   ale ne pro komisi. Lepší pauza než breptání.
3. **Krátká odpověď nejprve, detail pak.** "Ano, to platí. Důvod je…"
   Pokud člen komise chce víc, zeptá se.
4. **Neobhajuj se obrannou pozicí.** "Souhlasím, že to je limit, a v sekci
   X to označuji jako…" je silnější než "ale to není pravda, protože…".

### Když nevíš

Worst thing: vymyslet si odpověď. Komise to pozná a kredibilita padá.

Nejlepší šablona ([Paperpile](https://paperpile.com/g/thesis-defense/),
[ECHER](https://echer.org/defense-questions/)):

> "Tohle jsem v práci nezkoumal, ale myslím, že by se to dalo přiblížit
> přes [konkrétní mechanismus / zdroj], protože [důvod]. Pro reálnou
> odpověď by bylo potřeba [co konkrétně udělat]."

Tahle šablona ukazuje, že myslíš jako výzkumník, i když odpověď neznáš.
Holé "nevím" je legitimní, ale ne na každou otázku — komise pak zapochybuje
o hloubce porozumění.

**Speciální případ:** komise občas pokládá otázky, na které sama nezná
odpověď, jen chce vidět, jak myslíš ([ServiceScape](https://www.servicescape.com/blog/17-thesis-defense-questions-and-how-to-answer-them)).
Není to past, je to pozvání k diskusi.

## 6. Rehearsal protokol

Zdroje se neshodnou na konkrétním počtu opakování (od 3× po "celý měsíc",
[Paperpile](https://paperpile.com/g/thesis-defense/),
[Renee Lin](https://reneelin2019.medium.com/preparing-my-thesis-defense-in-3-days-ee2ffa4f628c)).
Funkční minimální protokol pro BP:

**T-7 dní:** první draft slidů hotový. Přečíst nahlas sám pro sebe **ze
slidů**, ne z poznámek. Měřit čas. Pokud to trvá 18 minut na 12-minutové
okno, pryč musí ~30 % obsahu.

**T-5 dní:** druhá průchod, už s časem v normě. Nahrát si video z mobilu
(stačí selfie kamera). Při zpětném sledování všímat si: kde čteš ze slidu,
kde mluvíš příliš rychle, kde říkáš "ehm" a "vlastně".

**T-3 dny:** první lidský posluchač. Nemusí to být odborník — naopak,
**laik odhalí, kde předpokládáš znalost**, kterou komise FIS taky nemusí
mít. ([Mernst](https://homes.cs.washington.edu/~mernst/advice/giving-talk.html)
doporučuje publikum <10 lidí pro lepší feedback.) Po prezentaci se zeptej:
"Co jsi pochopil jako hlavní message?" Pokud odpověď nesedí, rewrite hooku.

**T-2 dny:** druhý průchod před stejným posluchačem nebo před vedoucím.
Zaměřit se na Q&A: ať tě posluchač na 5 minut zatlačí otázkami.

**T-1 den:** poslední průchod sám, nahlas, plné 12 minut bez přerušení.
**Žádné velké změny v textu**, jen úprava drobností. Pak STOP — další
přepisování v poslední den zhoršuje, ne zlepšuje.

**Den D:** ráno *neopakovat celou prezentaci.* Jen si projet nadpisy slidů
a tři klíčová čísla, abys je měl v hlavě. Plný průchod ráno před obhajobou
unaví hlas a zvyšuje stres.

## 7. Co převzít z AI eng conf stylu

Konkrétní prvky, které **fungují i v akademickém kontextu**:

**Vizuál a struktura:**

- **Bezpatkový font, hodně white space, jeden claim per slide.** AI eng
  talky tohle dělají dobře, akademici často špatně.
- **Title jako věta** ("Bicycles are hard for LLMs to draw"), ne jako
  nadpis. Karpathy i Willison to dělají systematicky.
- **Diagramy místo bullet pointů.** Karpathyho Software 1.0/2.0/3.0 by
  byly nečitelné jako odrážky; jako trojice ikon s arrows fungují.

**Narativní páteř:**

- **Recurring artifact / red thread.** Willisonův "pelican on a bicycle"
  je geniální device, protože **jeden vizuální motiv** drží 30 modelů
  pohromadě. Ekvivalent pro tuhle BP: **jedna konkrétní funkce / file
  z dunning systému** procházející napříč iteracemi. Komise vidí stejný
  artefakt v iteraci 1, 3, 5 a sama vnímá pokrok. Funguje líp než tabulka
  metrik.
- **Konkrétní příklady, ne abstraktní claimy.** "Agent vytvořil 6 nových
  abstrakcí, z nichž 2 byly nepoužité" je mnohem silnější než "kvalita
  kódu kolísala".
- **Reálné artefakty na slidu.** Screenshot kódu, výřez findings tabulky,
  ne stock diagramy.

**Energie a tón:**

- **Vlastní hlas a přesvědčení.** Akademici často mluví distancovaně
  ("v této práci je analyzováno…"). První osoba ("já jsem se rozhodl
  měřit X, protože Y") je v pořádku a působí kompetentně.
- **Demo-mindset.** I když nedáváš živé demo, ukaž věci, které **reálně
  existují** — repo, README, AGENTS.md. Komise tím získá důvěru, že to
  není jen text v thesis.

**Pacing:**

- **Build-up k výsledku.** Karpathy nezačne "Software 3.0 je důležité",
  ale postaví 1.0 → 2.0 → 3.0 progresi. Ekvivalent: nezačni ablacemi,
  postav arc "měřit jsme nedovedli → P/Q/E rámec → iterace → ablace".

## 8. Co NEpřevzít z conf stylu

Akademická komise není self-selected publikum AI Engineer Summitu. Co
**nedělej**:

- **Žádné memes, žádné GIFs, žádné gagy.** Conf talk si je může dovolit,
  protože publikum přišlo na show. Komise tě hodnotí formálně. Vtipný
  meme = ztracená kredibilita.
- **Žádné cliffhangery ("ale o tom za chvíli…").** Conf talk je
  performance, obhajoba je výklad. Říkej věci přímo.
- **Žádný "vibes" jazyk** ("super zajímavé", "mind-blowing", "game changer").
  Drž se odborné češtiny. "Pozoruhodné", "neočekávané", "významný posun"
  fungují líp.
- **Žádný hype tón.** "AI agenti změní programování navždy" je conf
  opening; v BP je to silný claim bez opory. Místo toho: "Ukazuje se, že
  pro určité třídy úloh AI agenti dosahují použitelných výsledků, ale
  měření této použitelnosti není standardizované — což je problém, který
  tato práce řeší."
- **Žádné self-deprecating openings ("I'm not really an expert, but…").**
  Willison si může dovolit "my original scope was foolish", protože je
  uznávaná autorita. Student v obhajobě tím ztrácí, ne získává.
- **Žádné dlouhé živé demo.** Conf talk si může dovolit 5 min. demo. V
  obhajobě 12 min. je každá vteřina drahá a riziko technického selhání
  není akceptovatelné. Pokud demo, max 30 vteřin a předem nahrané jako
  video v slidu.
- **Neformální oslovení komise.** Žádné "vy lidi víte", "jak všichni
  víme z Twitteru". Komise nepročítá AI eng conf newsletter.

## 9. Časté chyby

Konkrétní antipatterny ([Wonderslide](https://wonderslide.com/blog/guide-to-creating-effective-presentations-for-thesis-defenses/),
[Julia Wąsala](https://juliawasala.nl/blog/msc-presenting-mistakes/),
[Quora threads](https://www.quora.com/What-is-a-huge-no-no-when-you-present-your-thesis)):

1. **Snaha shrnout všechno.** 60-stránková práce se nedá zopakovat za 12
   minut. Komise to četla. Vyber 3 nejsilnější příspěvky a ukaž je do
   hloubky.
2. **Čtení slidů.** Komise umí číst rychleji než ty mluvíš. Slide podporuje
   sdělení, není sdělení sám.
3. **Slidy přeplněné textem nebo malými grafy.** Když členové komise
   přimhouří oči, je to game over. Test: zvládneš slide z 4 metrů přečíst?
4. **Defenzivní reakce na kritiku v posudku.** Komise očekává, že **uznáš
   limit a ukážeš porozumění**, ne že budeš obhajovat každé slovo.
5. **Nepřipravené reakce na otázky z posudků.** Posudky máš dopředu, žádná
   improvizace není omluvitelná.
6. **Slabá první minuta** ("dnes vám představím…" + outline slide). Ztráta
   pozornosti hned na začátku se těžko dohání.
7. **Ukazování na obrazovku laptopu, ne na plátno.** Komise vidí jen
   tvoje záda. Pokud je laser pointer dostupný, používej ho — jinak gestikuluj
   k plátnu.
8. **Termínová nekonzistence.** Pokud v thesis máš "instrukce" a v
   prezentaci najednou "prompts", komise se chytne. Použij `TERMINOLOGIE.md`
   jako kontrolu i pro slidy.
9. **Žádný backup.** Slidy musí být v PDF na flash disku **i** v cloudu
   **i** v emailu sám sobě. Powerpoint na cizím počítači selhává typografií.
10. **Příliš silné claimy o generalizaci.** Tahle BP je **feasibility**,
    ne validace ani generalizace. Pokud řekneš "ukázal jsem, že P/Q/E
    funguje pro AI agenty", komise se okamžitě zeptá "na základě jednoho
    projektu?". Říkej "ukázal jsem, že rámec je smysluplně aplikovatelný
    v daném prostředí, a nastínil jsem postup, který lze testovat dál".
11. **Prezentace v 16:9 na 4:3 projektoru.** Ověř formát s katedrou.
12. **Černé pozadí.** V akademické místnosti s nepříliš silným projektorem
    se ztrácí kontrast. Bílé pozadí je default.

## 10. Zdroje

### Akademické / thesis defense

- [Paperpile — How to prepare an excellent thesis defense](https://paperpile.com/g/thesis-defense/)
  — solidní 6-bodový rámec, hlavně pro otázky, na které neznáš odpověď.
- [BeMo — 40 Thesis Defense Questions](https://bemoacademicconsulting.com/blog/thesis-defense-questions)
  — širší katalog typových otázek; dobrý sparring partner pro přípravu.
- [ServiceScape — 17 Thesis Defense Questions](https://www.servicescape.com/blog/17-thesis-defense-questions-and-how-to-answer-them)
  — kratší, ale s ukázkovými odpověďmi a logikou za nimi.
- [ECHER — PhD defense questions](https://echer.org/defense-questions/)
  — strukturováno podle "what / why / how"; dobrá heuristika pro přípravu.
- [Wonderslide — Effective Thesis Defense Presentations](https://wonderslide.com/blog/guide-to-creating-effective-presentations-for-thesis-defenses/)
  — slide design specifický pro obhajobu.

### České zdroje (proceduální)

- [UISK FF UK — Zpracování práce a její obhajoba](https://uisk.ff.cuni.cz/cs/studium/zaverecne-prace-bc-mgr/zpracovani-prace-a-jeji-obhajoba/)
  — popis průběhu obhajoby na UK FF; uvádí konkrétně přípravu odpovědí
  na otázky z posudků v písemné podobě.
- [UPOL — Průběh obhajob (PDF)](https://psych.upol.cz/fileadmin/userdata/FF/katedry/pch/studentum/Studium/2.2._Prubeh_obhajob_a_SZZK_na_Katedre_psychologie_prezencni_a_online_formou_01.pdf)
  — explicitní procedura: pořadí kroků, timing, role komise.
- [Diplomka24 — Příprava prezentace k obhajobě](https://www.diplomka24.cz/cz/diplomkanaprvnidobrou/jak-pripravit-prezentaci-k-obhajobe)
  — česká očekávání ohledně struktury prvního slidu, délky, formálních
  prvků.
- [Pavel Semerád — Jak se připravit na obhajobu BP](https://tatulda.cz/obhajoba-bakalarske-diplomove-prace/)
  — praktické tipy z české perspektivy; zmiňuje 5–7 min standard pro BP.
- [ProStudent — Obhajoba bakalářské práce](https://www.odborne-prace.cz/blog/obhajoba-bakalarske-blogu)
  — co komisi zajímá: cíl, přidaná hodnota, metody.

### Technical talk design

- [Michael Ernst (UW) — Giving a technical talk](https://homes.cs.washington.edu/~mernst/advice/giving-talk.html)
  — nejhutnější jednostránkový zdroj. Konkrétní pravidla: 1 min/slide,
  3 řádky max, žádný úvodní outline, závěrečný slide visí během Q&A.
- [MIT CommLab — Technical Presentation](https://mitcommlab.mit.edu/meche/commkit/technical-presentation/)
  — design rules pro inženýrský talk.
- [PLOS — Ten Simple Rules for Effective Presentation Slides](https://pmc.ncbi.nlm.nih.gov/articles/PMC8638955/)
  — peer-reviewed, evidence-based; cituje konkrétní studie o vnímání.

### Opening / hook

- [Moxie Institute — First 60 Seconds](https://www.moxieinstitute.com/how-to-open-a-speech-60-seconds/)
  — detail breakdown: 30s hook + 10s credibility + 20s agenda.
- [Genard Method — Critical First 60 Seconds](https://www.genardmethod.com/blog/bid/169811/how-to-begin-a-presentation-the-critical-first-60-seconds)
  — typologie hooks: story, statistic, bold statement, question.

### AI eng conf reference (inspirace)

- [Simon Willison — Six months in LLMs (annotated transcript)](https://simonwillison.net/2025/Jun/6/six-months-in-llms/)
  — masterclass v "recurring visual artifact as narrative spine". Pelican-
  on-bicycle drží 30 modelů pohromadě.
- [Karpathy — Software 3.0 (Latent Space recap)](https://www.latent.space/p/s3)
  — masterclass v "build-up to claim". 1.0 → 2.0 → 3.0 jako progresivní
  rámec, každá fáze definuje další.
- [George Mandis — Karpathy talk summary](https://gist.github.com/georgemandis/b2a68b345262b94782fa6b08e41fbcf2)
  — kratší přehled struktury Karpathyho talku.
- [Vellum — Big Ideas from AI Engineer World's Fair](https://www.vellum.ai/blog/top-takeaways-from-the-ai-engineer-worlds-fair)
  — recap stylu více talků; užitečné pro pochopení common patterns
  v žánru.
