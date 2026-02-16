# Agent Orchestration Research

## Kontext
Research o tom jak spouštět autonomní coding agenty, orchestrovat multi-issue projekty, a sbírat metriky pro experimenty.

## OpenCode (anomalyco/opencode) — 100k stars
- Open-source AI coding agent, TypeScript, vendor-independent
- Čte **AGENTS.md** nativně
- Non-interactive: `opencode run "task"`, `opencode run --format json "task"`
- Server mode: `opencode serve` + `opencode run --attach`
- Subagenti: context-isolated, delegace úkolů, omezené nástroje
- Aktivní vývoj: async background sub-agents (Issue #5887), A2A protocol (#3023)
- **Nemá auto-compaction** — závisí na modelu

## GLM-5 (ZhipuAI)
- 744B parametrů (MoE), 200k context window, MIT licence
- SWE-bench Verified: 77.8% (vs Claude Opus 4.5: 80.9%, GPT-5.2: 75.4%)
- OpenAI-compatible API: `https://api.z.ai/api/paas/v4/`
- **Není nativně v OpenCode** — nutný custom provider config:
```json
{
  "providers": {
    "zai": {
      "package": "@anthropic-ai/sdk",
      "baseURL": "https://api.z.ai/api/paas/v4/",
      "apiKey": "{env:ZAI_API_KEY}"
    }
  }
}
```
- Máme neomezené předplatné → ideální pro experimenty

## Orchestrační vzorce

### A. Jeden session na celý projekt
- Cross-issue knowledge retention
- Riziko: context overflow, signal dilution
- Pro malé projekty (< 3 issues)

### B. Jeden session per issue ← INDUSTRY CONSENSUS
- Čistý context, reprodukovatelné
- Agent ztrácí cross-issue kontext (musí číst kód)
- "One session per task > one long session" (willness.dev, Anthropic engineering)

### C. Orchestrátor + sub-agenti
- Hlavní agent deleguje specializovaným sub-agentům
- 72% enterprise AI projektů 2025 (vs 23% 2024)
- OpenCode má subagent support (General, Explore)
- Komplexnější setup

### D. Human-in-the-loop
- Agent navrhne → human approval → execution
- Pro critical decisions, referenční implementaci

### E. Script-based sekvenční
```bash
for issue in 3 4 5 6 7; do
  opencode run "Implement issue #$issue following AGENTS.md"
done
```
- Nejjednodušší, plná kontrola, snadné metriky

### Jemnější granularita — session per fáze
```bash
opencode run "Plan implementation for issue #3"
opencode run "Write tests for issue #3 from AC"
opencode run "Implement issue #3 to pass tests"
```

## Context Window Management Strategie

### Compaction (Claude Code)
- Auto-compact při 95% capacity
- Hierarchical summarization: novější verbatim, starší komprimované
- Structured artifacts (plans, task lists) mají vyšší prioritu

### Repo Maps (Aider)
- Stručná mapa celého repo s klíčovými signatures
- Graph ranking pro relevantní části
- Dynamicky fituje do token budget

### Chat History Summarization (Aider)
- Recursive summarization starších messages
- Progressive disclosure

### Git as Memory (Anthropic engineering blog)
- Commit messages + progress file
- Agent může revert bad changes
- Structured logs pro recall

### Performance Degradation
- 1M context: degradace kolem 256k tokens
- Proactive thresholds: compact PŘED "rot" zone
- Attention je quadratic: double context = 4x computation

## Industry Convergence Pattern
1. Research — agent explores codebase
2. Plan — creates implementation plan
3. Implement — fresh agent per task
4. Repeat — until all tasks done

## Metriky k sbírání
- Time per issue (automatic)
- Git commits, files changed, lines added/removed (automatic)
- Token usage (API-dependent)
- Test pass rate, mutation score (automatic)
- Code quality, PR review (manual / LLM-as-judge)

## Zdroje
- Anthropic: Effective context engineering for AI agents
- Anthropic: Effective harnesses for long-running agents
- Anthropic: 2026 Agentic Coding Trends Report
- willness.dev: Why You Need To Clear Your Coding Agent's Context Window
- Martin Fowler: Autonomous Coding Agents
- Microsoft: AI Agent Orchestration Patterns
- Mike Mason: AI Coding Agents in 2026 — Coherence Through Orchestration
- O'Reilly: Conductors to Orchestrators
- SWE-agent paper (NeurIPS 2024)
- Aider docs: Repository map, Git integration
- OpenCode docs: Agents, CLI, Config

## Otevřené otázky
1. Jaký orchestrační vzorec pro naše experimenty? (B vs C vs E?)
2. Session per issue nebo session per fáze?
3. Jak nastavit GLM-5 v OpenCode?
4. Jak sbírat token usage z GLM-5 API?
5. Orchestrace jako další experimentální dimenze nebo fixní proměnná?
6. Docker izolace pro reprodukovatelnost?
