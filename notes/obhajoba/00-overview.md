# Obhajoba BP — overview a navigace

> Master rozcestník pro přípravu obhajoby. Sebráno 2026-05-07.
> Detailní podklady v `01-fis-pravidla.md` (FIS rules) a `02-best-practices.md`
> (presentation craft).

## Soubory v této složce

- **`00-overview.md`** (tento) — rozcestník, timeline, klíčová rozhodnutí, otevřené otázky
- **`01-fis-pravidla.md`** — oficiální FIS/VŠE pravidla obhajoby BP, šablony, kritéria, posudky, technika
- **`02-best-practices.md`** — jak prezentovat: arc, slide design, Q&A, rehearsal, conf inspirace

## Klíčová rozhodnutí (status k 2026-05-07)

### Nástroj: **LaTeX Beamer s FIS šablonou**

Proč ne Slidev (původní doporučení): FIS vyžaduje šablonu z intranetu
(PowerPoint nebo LaTeX/Beamer verze). Vlastní theme by formálně nesplnil.

Proč Beamer:
- Splňuje formální požadavek (FIS poskytuje LaTeX šablonu)
- Zůstává v dev workflow (git, `.tex`, build)
- Konzistence s thesis (taky LaTeX)
- Exportuje PDF → vyhneme se PowerPointu

PowerPoint volba dává smysl jen pokud bychom chtěli embedovat video
nebo animace, které Beamer nezvládne. Pravděpodobně nepotřebujeme.

**TODO #BEAMER-1:** stáhnout FIS Beamer šablonu z intranetu
(SharePoint → Obhajoba bakalářské práce → LaTeX verze).

### Délka: **~10 min prezentace** (potvrzeno pro AIN program)

Cíl 8–12 obsahových slidů + titulní + závěrečný.

### Demo: **screenshoty / krátké screencasty embedded v slidech**

Důvod: zákaz USB, upload do InSIS = pravděpodobně školní PC.
Žádné živé spuštění OpenCode/Claude. Veškeré ukázky předem nahrané.

## Timeline

```
2026-05-07 (dnes) │ 4 dny do odevzdání BP
2026-05-11 12:00  │ DEADLINE: BP do InSIS + e-mail Hertlové (KIT sekretářka)
                  │ → 4 dny stresu, ale prezentaci NEŘEŠÍME teď
2026-05-12 → 06-01 │ příprava prezentace, hlavní práce (3+ týdny)
~2026-06-01       │ rozpis SZZ zveřejněn (přesný den obhajoby + komise)
                  │ + InSIS odevzdávárna prezentace se otevírá
~obhajoba T-3     │ posudky k dispozici v InSIS → příprava ústních reakcí
obhajoba T-1 23:59 │ DEADLINE: upload prezentace do InSIS odevzdávárny
2026-06-15 až -26 │ okno obhajob AI programu
```

**Důsledek pro plán:** prezentaci aktivně nestavíme dřív než po 11. 5.
Do té doby finalizujeme thesis. Po 11. 5. začíná ~5 týdnů na prezentaci,
což je dostatek času.

## Workflow přípravy (pořadí kroků)

Závisí to na sobě — neskákat ke slidům dřív, než je narrativ:

1. **Audience model** — kdo bude v komisi, co ví, co je pro ně buzzword.
   Závisí na zveřejnění rozpisu (~T-14 dní). Předtím pracujeme s default
   modelem „mix FIS akademiků, různá orientace AI/SE/byznys".
2. **Narrativ na A4** — bez slidů, jen text. Hlavní claim + 3 podpůrné body
   + 15 anticipovaných Q&A. **80 % práce sedí tady.**
3. **Kostra slidů** — 10–12 slidů odpovídajících narrativu, jen nadpisy.
4. **Vizuální iterace** — diagramy, čísla z `experiments/runs/`, AGENTS.md
   diff highlight. Recurring artifact (jeden file/funkce z dunningu)
   procházející napříč iteracemi.
5. **Rehearsal** — T-7, T-5 (video selfie), T-3 (lidský posluchač),
   T-2, T-1 (poslední průchod).
6. **Q&A protokol** — den před: znovu projít posudky, vypsat ústní reakce.

## Klíčové constraints (nepřetržitě hlídat)

- **Délka 10 min** — ne 15. Anglické zdroje radí 1 min/slide, FIS norma
  je 10 min, takže max 8–12 slidů s reálným obsahem.
- **Šablona FIS** — vlastní vzhled není volba.
- **Žádný update po posudcích** — slidy zamknout v okamžiku odevzdání BP
  resp. uploadu do InSIS T-1.
- **Žádné živé demo** — vše předem nahrané/screenshoty.
- **Backup** — PDF v cloudu, e-mailu sám sobě, na flashce. PowerPoint
  na cizím PC selhává typografií.

## Inspirace z AI eng confs — co přebrat

(detail v `02-best-practices.md` sekce 7–8)

**Vezmeme:**
- Title jako věta s tvrzením, ne nadpis
- 1 claim per slide
- Recurring artifact / red thread (jeden file z dunningu napříč iteracemi)
- Konkrétní čísla, ne abstraktní claimy („27 % LOC bylo duplikace v iteraci 2")
- Build-up arc („měřit jsme nedovedli → P/Q/E → iterace → ablace")

**NEbereme:**
- Memes, GIFs, gagy
- Cliffhangery
- „Vibes" jazyk
- Hype tón
- Self-deprecating openings
- Živé demo

## Open questions — od Tebe potřebuju vědět

Některé z toho odpovíš ze své paměti, jiné je třeba zjistit.

**A. Hned (Ty víš):**
1. **Kdo je vedoucí BP?** (jmenovitě, abychom věděli s kým konzultovat)
2. **Kdo je pravděpodobně oponent?** (vedoucí ho navrhuje — možná to už víš)
3. **Předmět SZZ** — registrovaný 4AIN nebo AIN, garant Novotný? (ověřit)
4. **Plánovaný den obhajoby v okně 15.–26. 6.?** (rozpis přijde T-14, ale
   můžeš mít preferenci nebo omezení = řekneš sekretářce KIT v
   registračním e-mailu)

**B. Akce na Tebe (e-mail/dotazy):**
5. **Stáhnout FIS Beamer šablonu** ze SharePointu (Obhajoba bakalářské
   práce → LaTeX verze) → položíme do `presentation/`
6. **Stáhnout AI program okruhy a literaturu** (intranet) → vědět, co
   může komise propojovat s BP
7. **Ověřit u Hertlové / vedoucí:** vlastní notebook povolen pro demo?
   (Pro tuhle BP relevantní — pokud ano, můžeme udělat 30s screencast
   live místo embedovaného videa.)
8. **Registrace mimosemestrálního kurzu pro SZZ** — proběhla? (Bez ní
   přihlášení neúplné; e-mail Hertlové ji potvrzuje.)

**C. Otevřené z FIS strany (`01-fis-pravidla.md` sekce 8):**
9. Reálná délka Q&A + odborné rozpravy (FIS to nedefinuje, plán: ~30 min
   na celý akt)
10. Existuje rubrika hodnocení obhajoby samotné? (FIS nezveřejňuje)

## Kritická poznámka — priorizace v 4 dnech do 11. 5.

Prezentace TEĎ NENÍ priorita. Priorita je:

1. **BP odevzdat 11. 5.** (cleanup pass per CLAUDE.md)
2. **Registrační e-mail Hertlové** (povinný, jinak přihlášení neplatné)
3. Pak teprve prezentace (5+ týdnů na ni)

Po 11. 5. překlopíme focus na obhajobu.
