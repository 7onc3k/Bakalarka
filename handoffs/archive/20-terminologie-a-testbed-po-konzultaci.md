# Handoff 20 — Terminologie + volba testbedu po konzultaci (2026-01-22)
Datum: 2026-01-22

## Terminologie (explicitně od uživatele)
- Uživatel zvažuje **nepoužívat termíny “páky a signály”** a nahradit je slabší/neutralnější sémantikou.

## Konzultace s vedoucím / očekávání (explicitně od uživatele)
- Vedoucí doporučil, aby uživatel **psal vlastní kód**, protože to pomůže uspět u obhajoby.

## Poznámka dne (zdroj)
- `notes/daily/2026-01-22.md`

## Zvažovaný posun v experimentu (explicitně z poznámky dne)
- Možná **nepoužívat RealWorld** jako testbed.
- Místo toho **vytvořit vlastní projekt** a nakonfigurovat agenta, aby generoval testy.
- Původně padl termín “flaky testy”, ale uživatel upřesnil, že tím myslel primárně **test cheating**
  (model má tendenci “rozsvítit testy zeleně”, i když implementace je ve skutečnosti špatně).

## Upřesnění z diskuze (2026-01-22)
- Uživatel navrhuje napsat **vlastní kód**, záměrně ho **rozbít** (seeded bugs / špatné chování) a následně testovat,
  jak si agent vede při **tvorbě testů** v různých konfiguracích (a zda/kolik “cheatuje”).

