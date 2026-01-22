# Handoff 19 — Experiment: páky, “výborné” artefakty, různé konfigurace agentů (směr A)
Datum: 2026-01-22

## Co chce uživatel udělat (explicitně)
- Nejprve **nadefinovat “páky”** (tj. co v prostředí/procesu změním) a co jsou **“výborné artefakty”**.
- Následně **nakonfigurovat více agentů / režimů agenta** různým způsobem.
- Poté **pozorovat a vyhodnocovat**, co agent:
  - udělal dobře / špatně,
  - udělal nečekaně (neočekávané chování je důležitý signál),
  - jaké chyby/selhání vznikají a proč.

## Jak to zapadá do směru práce (alignment)
- Primární směr: **kvalita komunikace + lidská kontrola** (decision-gating).
- Artefakty, které se budou QA‑ovat:
  - issue (high-bandwidth zadání),
  - decision packet (impact/alternativy/rizika + jasná otázka k rozhodnutí),
  - change plan / impact report (co se bude měnit, kde, proč),
  - a až sekundárně implementační výstupy (diff, test results).

## Co znamenají “páky” v tomto experimentu (pracovní definice)
- Páka = **explicitně vyžadovaný artefakt nebo pravidlo**, které má změnit chování agenta.
  - příklad: “agent před změnou vždy vytvoří impact report”
  - příklad: “agent nesmí pokračovat bez schválení decision packetu”
  - příklad: “issue musí obsahovat alternativy + rizika + DoD”

## Co znamená “výborný artefakt” (pracovní definice)
- “Výborný” = **rozhodnutelný a auditovatelný**:
  - jasný popis současného stavu,
  - explicitní dopad změny (impact),
  - alternativy + tradeoffs,
  - rizika + mitigace,
  - jasná kritéria hotovosti (DoD / acceptance criteria),
  - odkazy na relevantní části repo/spec/testů.

## Co se bude vyhodnocovat (zamýšlené typy signálů)
- **Kvalita artefaktů** (checklist/rubrika, ideálně binární pass/fail pro položky).
- **Gating compliance**: jestli agent pokračoval bez schválení / i když člověk nerozumí.
- **Scope drift**: kolik změn se stalo mimo plán/issue.
- **Dotazy na “relevantní issue”**:
  - jestli agent eskaluje na správných místech,
  - jestli dotazy nejsou zbytečné/opakované.
- **Neočekávané chování**: co agent udělal “jinak, než by člověk čekal” (kvalitativní rozbor).

## Otevřené body k ujasnění (před startem běhů)
- Co přesně je “konfigurace agenta” v našem kontextu:
  - systémové instrukce / role,
  - povinné artefakty,
  - pravidla pro eskalaci,
  - povolené nástroje a QA gates.
- Kolik konfigurací a kolik běhů je realistické udělat (A/B, nebo A/B/C…).
- Na jakém “testbedu” poběží běhy (pravděpodobně RealWorld backend), aby šlo dělat více běhů.

