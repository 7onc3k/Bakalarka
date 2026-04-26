# Diskuze: Projekt a Metodologie BP

Datum: 2026-01-18

## Kontext

Diskuze o tom jaký projekt použít pro BP a jakou metodologii.

## Klíčové rozhodnutí

### 1. BP je o metodologii, ne o produktu

**Core otázka BP:** Jak nastavit prostředí (scaffolding) pro AI agenty?

Projekt je jen prostředek k demonstraci - zajímavá je metodologie, ne co projekt dělá.

### 2. Směr: CLI pro AI governance

**Proč CLI:**
- Univerzální - funguje se všemi coding agents (Claude, Codex, Gemini, ...)
- Testovatelné samo na sobě (bootstrapping)
- Využívá GH issues (diferenciace od BMAD, Spec Kit, OpenSpec)

**Možné funkce (z #136 - páky/signály):**
- `scaffold issue` - vytvoří high-bandwidth issue
- `analyze codebase` - diagram změn
- `check context` - metrika jestli má agent dost kontextu
- `sync docs` - dokumentace jako paměť

### 3. Přidaná hodnota vlastního systému

Hypotéza: Pro one-person companies / malé týmy je lepší vlastní systém než standard.

**Argumenty:**
- Znalost vlastního systému > použití cizího
- Manifest: bude hodně one-person companies
- Spec-driven development - každý si přizpůsobí

**Otevřená otázka:** Bude standard pro spec-driven dev nebo každý svůj?
- Historicky: formát se standardizuje, implementace zůstává volba (viz Markdown, Git)

## Research metody - K PROZKOUMÁNÍ

### Design Science Research (DSR)
- Vytváříš artefakt a zkoumáš jak funguje
- Hevner et al. (2004)
- Fáze: Problem → Objectives → Design → Demonstrate → Evaluate → Communicate

### Otázka: DSR vs specifičtější metody?
- DSR je obecné - "vytvořit a zkoumat artefakt"
- Co když zkoumám sám sebe při používání? → Action Research?
- Jaké další metody existují?

**TODO:** Prozkoumat rozdíly mezi:
- Design Science Research
- Action Research
- Case Study
- Participatory Design
- Autoethnografie?

## Propojení s DigitalFusion

```
BP (teorie + kontrolovaný experiment)
    │
    ├── CLI nástroj (artefakt)
    ├── Metodologie (jak vyvíjet s AI)
    │
    └── Testování na jednoduchém projektu
            │
            ▼
DF (field study - reálné prostředí)
    │
    └── Aplikace principů z BP
```

## Zdroje k prozkoumání

- BMAD methodology
- Spec Kit
- OpenSpec
- agents.md konvence
- skills.md konvence
- #136 (DF) - páky a signály pro issues
- #51 (DF) - Autonomous Engineering

## Další kroky

1. [ ] Prozkoumat research metody (DSR vs Action Research vs ...)
2. [ ] Podívat se na BMAD, Spec Kit, OpenSpec
3. [ ] Definovat scope CLI nástroje
4. [ ] Konzultace s vedoucím BP
