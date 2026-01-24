# Konzultace 1 — První schůzka s vedoucím
Datum: 2026-01-22

## Průběh schůzky

### Background
- Vedoucí se ptal na background, diskuze o TypeScriptu
- Vedoucí nebyl moc v obraze že TS je enterprise ready

### Fáze vývoje
- Já řekl 4 fáze, vedoucí řekl 7 (klasický SDLC)
- Vedoucí nabízel zúžit scope na jednu fázi

### Diskuze o testování/QA
- Zmínil jsem že bych si vzal testování
- Vedoucí: "QA se nedělá jenom na konci, testuje se v celém průběhu"
- Zmínil jsem že LLM mají tendenci cheatovat testy
- Vedoucí varoval: "u obhajoby by se mohli ptát proč testuje až na konci"

### Scope diskuze
- Já chtěl široký záběr (governance je široké)
- Vedoucí se bál že to nestihnu, radil zúžit
- Měl jsem pocit že mě trochu podcenuje

## Co vedoucí řekl (klíčové)

1. **"Měl bys psát vlastní kód"** - pomůže to u obhajoby
2. **"Vyber si projekt"** - něco konkrétního co doručíš
3. **"Zúžit scope"** - cílem BP je něco doručit
4. **"QA v celém průběhu"** - ne jen testování na konci

## Moje reakce po schůzce

### Proč ne RealWorld
- Vedoucí chtěl vlastní kód
- RealWorld je cizí projekt, neměl bych "nuance v hlavě"
- Potřeboval jsem něco deterministického kde můžu nachytat LLM

### Proč Billing Reminder Engine
- Vlastní projekt (splňuje požadavek vedoucího)
- Hard logic, jasné invarianty, deterministické
- Užitečné pro DF (využiju to)
- Testovatelné - můžu objektivně měřit kvalitu

## Jak to řeší napětí

| Vedoucí chce | Já potřebuju | Řešení |
|--------------|--------------|--------|
| Zúžit scope | Široký záběr (governance) | Úzká implementace + široké zkoumání |
| Vlastní kód | Něco užitečného | Billing Reminder = vlastní + pro DF |
| QA v průběhu | Testovat agenty | QA jako průběžná aktivita v celém SDLC |
