# Agent Operating Framework - Brainstorming

Datum: 2026-01-18
Navazuje na: `02-projekt-a-metodologie.md`

---

## Kontext

Diskuze o tom, jak vytvořit holistický framework pro agentní systémy, inspirovaný ITIL/CMMI ale specifický pro AI agenty.

## Klíčový insight

**ITIL/CMMI jsou pro lidi. Co je ekvivalent pro agenty?**

| Pro lidi | Pro agenty | Status |
|----------|------------|--------|
| ITIL (service management) | ??? | Neexistuje |
| CMMI (process maturity) | ??? | Neexistuje |
| SOPs (procedures) | skills.md | Částečně |
| Meetings | Decision Records? | K definování |
| Knowledge base | Dokumentace | Nesystematicky |

## Návrh: Agent Operating Framework

```
┌─────────────────────────────────────────────┐
│         Agent Operating Framework           │
├─────────────────────────────────────────────┤
│                                             │
│  SPECS          SKILLS        MEMORY        │
│  (co dělat)     (jak dělat)   (co vědět)    │
│  CLAUDE.md      skills.md     docs/         │
│  issues         SOPs          handoffs/     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  GOVERNANCE              METRICS            │
│  (kdy eskalovat)         (jak měřit)        │
│  confidence index        success rate       │
│  human-in-loop rules     iterations         │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  COMMUNICATION                              │
│  (jak koordinovat)                          │
│  decision records, handoffs, events         │
│                                             │
└─────────────────────────────────────────────┘
```

## Alternativa meetingů

**Proč lidi mají meetings:**
- Sync kontextu
- Rozhodování
- Koordinace
- Budování vztahů (agenti nepotřebují)
- Brainstorming

**Pro agenty → Decision Records (async):**

```
DECISION RECORD
─────────────────────────────────
Context: [co řešíme]
Options: [možnosti]
Analysis: [pro/proti]
Decision: [rozhodnutí]
Decided by: [člověk / agent / oba]
Timestamp: [kdy]
```

## Typy komunikace

```
Agent ←→ Agent:
    - Handoff (předání práce)
    - Shared context (společný dokument)
    - Event (jeden dokončil → druhý začíná)

Agent ←→ Člověk:
    - Eskalace (agent neví)
    - Review (člověk kontroluje)
    - Decision request (agent navrhuje, člověk rozhoduje)
    - Brainstorming (interaktivní diskuze)
```

## CMMI pro agenty - Maturity Levels

| Level | Popis | Příklad |
|-------|-------|---------|
| 1 - Initial | Chaos, ad-hoc prompty | "Udělej mi web" |
| 2 - Managed | Základní specs | CLAUDE.md existuje |
| 3 - Defined | Standardizované procesy | Issue templates, skills.md |
| 4 - Quantitative | Měřené | Confidence index, success rate |
| 5 - Optimizing | Self-improving | Agent navrhuje zlepšení specs |

## Metodologie

**Konstrukční výzkum (DSR) + Akční výzkum**

- Vytváříme framework (artefakt)
- Testujeme ho na sobě při vytváření (bootstrapping)
- Dokumentujeme co funguje/nefunguje

## Bootstrapping přístup

```
My dva teď brainstormujeme framework
    │
    └── Tím TESTUJEME agent-human komunikaci
            │
            └── Dokumentujeme CO FUNGUJE
                    │
                    └── To se stane součástí frameworku
```

---

## Další kroky

1. [ ] Definovat první Decision Record - o čem rozhodujeme?
2. [ ] Testovat proces na reálném rozhodnutí
3. [ ] Iterovat strukturu na základě zkušenosti
4. [ ] Definovat vrstvy frameworku podrobněji

## Otevřené otázky

- Jak měřit "confidence index" - kdy agent může bezpečně pokračovat?
- Jak vypadá handoff agent→agent?
- Jak formalizovat eskalaci?
- Jaká granularita Decision Records?

## Reference

- ITIL (IT Infrastructure Library)
- CMMI (Capability Maturity Model Integration)
- skills.md konvence (SOPs pro agenty)
- agents.md konvence
- DF #136 - páky a signály
- DF #51 - Autonomous Engineering
