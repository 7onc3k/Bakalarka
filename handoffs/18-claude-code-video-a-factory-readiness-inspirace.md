# Handoff 18 — Claude Code video + Factory Agent Readiness (inspirace pro experiment)
Datum: 2026-01-22

## Zdroje (externí)
- Video: `https://www.youtube.com/watch?v=PnX30ZXxKco`
  - Poznámka (od uživatele): není k tomu paper; video bereme jako praktickou demonstraci.
- Factory článek: [Introducing Agent Readiness](https://factory.ai/news/agent-readiness)
  - Offline snapshoty v repu:
    - `handoffs/assets/external-sources/factory-agent-readiness.html`
    - `handoffs/17-factory-agent-readiness.md` (textový výtah pro grep/citace)

## Co si z toho bereme (explicitně z diskuze)
- U videa: bereme ho jako precedent “agent zkouší replikovat web app / workflow” a lze z něj převzít myšlenku
  **měřit schopnost modelů dosáhnout cíle** a co se děje **mezi fázemi** (artefakty, gating), i když není formální paper.
- U Factory: “agent readiness” rámuje problém jako:
  - agent není “rozbitý”, často je rozbitý **environment / codebase**
  - readiness jde měřit přes **piliře** (např. testing, docs, build, lint, security…) a **maturity levely**
  - hodnocení používá **binární kritéria (pass/fail)** a “gated progression”

## Hypotéza pro BP (jak to spojujeme s naším směrem A)
- Primární fokus: **kvalita komunikace + lidská kontrola**
  - Issue a decision packet jsou **artefakty**, které lze QA‑ovat.
- Factory “Agent Readiness” slouží jako inspirace pro:
  - “piliře” (co jsou typické slabiny prostředí)
  - “maturity levels” (co musí být splněno, aby agent mohl být autonomnější)
  - binární checklisty (méně subjektivní evaluace)

## Návrh experimentálního tvaru (waterfall + více běhů)
- Uživatel navrhl směr:
  - **waterfall** pipeline (fáze) a
  - **více běhů** s různými konfiguracemi
  - měřit **kvalitu artefaktů mezi fázemi** (ne jen výsledek na konci)

### Potenciální metriky / signály (padlo v diskuzi)
- Kolikrát se agent “zeptal na relevantní issue” (tj. vyžádal si rozhodnutí / kontext tam, kde dává smysl).
- Jestli jsou decision packety:
  - úplné (impact, alternativy, rizika, DoD)
  - srozumitelné
  - a jestli agent neprodukuje “zbytečné” kroky / změny (scope drift)

## Otevřené body k rozhodnutí (další diskuze)
- Jak přesně definovat “relevantní issue dotaz” (rubrika vs checklist).
- Jak definovat “zbytečné”:
  - zbytečný dotaz
  - zbytečný artefakt
  - zbytečná změna v kódu (diff mimo plán)
- Jakou zvolit sadu konfigurací běhů (např. baseline vs governed; nebo ablace artefaktů).

