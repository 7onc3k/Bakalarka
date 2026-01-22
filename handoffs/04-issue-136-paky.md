# Issue #136 - High-bandwidth issue templates

Datum: 2026-01-18
Zdroj: https://github.com/DigitalFusionCZ/digital-fusion-docs-8fe09747/issues/136

---

## Core koncept: Páky

**Páka** = malý effort, velký impact

High-bandwidth communication - věci které najednou předají hodně informací:
- **Diagramy** - jeden obrázek = tisíc slov, holistický pohled na codebase
- **Semantická struktura** - headings, labels které fungují pro člověka i LLM
- **Metriky/signály** - hned vidíš "proč" a "jak poznám že je hotové"

## Emoční prvek

- "Proč to vadí" je důležitější než "co je rozbité"
- Ne fake urgency, ale skutečný kontext bolesti
- Impact na člověka, ne jen technický popis
- Narrative arc místo bullet points

## Cíl issue template

1. Člověk přečte za 30s a ví co/proč/jak
2. LLM parsuje a rozumí kontextu
3. Ukazuje holisticky dopad na codebase
4. Komunikuje prioritu přes impact, ne fake urgency

## Z komentářů

### Index jistoty
- Metrika jak moc agent může bezpečně pokračovat
- Porovnání s předchozími prompty a kontextem

### Typy změn
- **Additivní změny** - jednodušší, méně rizika
- **Infrastruktura/scaffolding** - vyžaduje víc kontextu, review

### Platform layers (alternativa k lifecycle labels)

| Layer | Co to je |
|-------|----------|
| `platform` | Backend, shared infrastruktura |
| `product` | PageRefresh, LLM Monitor, ... |
| `services` | Klientská práce, interní použití |

## Workflow (aktuální chápání)

```
Člověk + agent diskutují potřebu
    ↓
Společně strukturují do high-bandwidth issue
(proč to vadí, diagram změn, acceptance criteria)
    ↓
gh issue create
    ↓
Implementace (člověk nebo agent)
```

## Otevřené otázky z issue

- Jaké sekce by měl mít issue template?
- Jak vizualizovat změny v codebase? (mermaid? ASCII?)
- Jaká semantika funguje pro LLM? (structured sections? YAML frontmatter?)
- Jak udělat aby issue šlo "přečíst rychle"?
- Kde je hranice mezi kontextem a dramatizací?

## Související

- #159 - GitHub Issues Cleanup
- #51 - Autonomous Engineering System

---

## Poznámka

Dokumentační agent (z handoff 01) je starý nápad. Aktuální směr je o **strukturované komunikaci** - issues, handoffs - jako páky pro lidi i agenty.
