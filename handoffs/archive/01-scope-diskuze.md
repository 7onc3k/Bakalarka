# Scope diskuze - poznatky

## Co uživatel chce z práce získat
- Naučit se pořádně procesy v SWE
- Mít vlastní IP které může uplatnit v agentním systému

## Zaměření práce
- Celý SDLC, ne jen úzká část
- Governance + operations dohromady (u agentů se to prolíná)
- Konfigurace a instrukce pro agenty = governance (ne programování nových nástrojů)

## Struktura práce
1. Zmapovat - co existuje, jaké jsou koncepty, jak se to jmenuje
2. Implementovat - nakonfigurovat, napsat instrukce, propojit nástroje
3. Vyhodnotit - funguje to? Kde jsou problémy?

## Nástroje které už existují (nebudou se programovat)
- GitHub/GitLab Actions
- CLI coding agents
- Git platforms project management
- Dokumentace v markdownu

## Identifikovaný gap
- Memory layer pro agenty není technický problém (RAG apod.)
- Problém je procesní/governance - chybí kvalitní dokumentace jako single source of truth
- Dokumentace = paměť (pro lidi i agenty)

## Dokumentační agent - koncept
- Agent běží na pozadí
- Sleduje: změny kódu, dokumentace, konverzace s AI agentem
- Uživatel pracuje výhradně s jedním AI agentem pro kontext
- Neomezené requesty = bruteforce reliability

## Architektura
- Primární agent: se kterým uživatel pracuje
- Dokumentační agent: sleduje a udržuje dokumentaci

## Spouštění
- Průběžná analýza při každé akci (připravuje draft)
- Finální zápis na git hook (atomický checkpoint)

## Dokumentace pokrývá celý SDLC
- Requirements/Planning: issues, specs, ADRs
- Design/Architecture: diagramy, tech specs, API docs
- Development: README, inline docs, contributing guides
- Testing: test plans, test cases
- Deployment/Operations: runbooks, deployment docs
- Maintenance: changelog, issue tracker, post-mortems
