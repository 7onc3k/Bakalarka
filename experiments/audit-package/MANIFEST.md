# Manifest doplňujících materiálů

Manifest uvádí auditně relevantní soubory pro případovou studii. Odkazy vedou na
autoritativní umístění v repozitáři. Tento adresář je pouze rozcestník.

## Vstupy a procedura

| Oblast | Podklady |
| --- | --- |
| Specifikace úlohy | [issue-1-spec.md](../infra/inputs/issue-1-spec.md), [issue-1-req-only.json](../infra/inputs/issue-1-req-only.json) |
| Instrukce a ablace | [AGENTS.md](../infra/inputs/AGENTS.md), [AGENTS-ablace-a.md](../infra/inputs/AGENTS-ablace-a.md), [AGENTS-ablace-b.md](../infra/inputs/AGENTS-ablace-b.md) |
| Operační procedura | [iteration-procedure.md](../infra/iteration-procedure.md) |
| Šablony výstupů běhu | [FINDINGS-template.md](../infra/FINDINGS-template.md), [DIAGNOSIS-template.md](../infra/DIAGNOSIS-template.md) |
| Changelog úprav instrukcí | [pilot-r1-to-r2.md](../infra/changelog/pilot-r1-to-r2.md), [pilot-r2-to-r3.md](../infra/changelog/pilot-r2-to-r3.md), [pilot-r3-to-r4.md](../infra/changelog/pilot-r3-to-r4.md), [pilot-r3-to-r5.md](../infra/changelog/pilot-r3-to-r5.md) |

## Hodnoticí schémata a skripty

| Oblast | Podklady |
| --- | --- |
| LLM-as-judge schémata | [p2-process-artifacts.md](../infra/judge/p2-process-artifacts.md), [q4-ac-coverage.md](../infra/judge/q4-ac-coverage.md), [q8-code-quality.md](../infra/judge/q8-code-quality.md) |
| Spuštění a vyhodnocení běhu | [new-run.ts](../infra/scripts/ts/new-run.ts), [analyze-run.ts](../infra/scripts/ts/analyze-run.ts), [summary.ts](../infra/scripts/ts/summary.ts) |
| Judge-based metriky | [judge.ts](../infra/scripts/ts/judge.ts) |
| Zdrojové metriky | [efficiency-from-transcript.ts](../infra/scripts/ts/efficiency-from-transcript.ts), [extract-efficiency.ts](../infra/scripts/ts/extract-efficiency.ts), [e1-report.ts](../infra/scripts/ts/e1-report.ts), [e1-pricing.ts](../infra/scripts/ts/e1-pricing.ts) |

## Pilotní běhy

| Běh | Instrukce | Diagnostika | Výstupy | Transcript | Judge výsledky |
| --- | --- | --- | --- | --- | --- |
| pilot-r1 | [AGENTS.md](../runs/pilot-r1/AGENTS.md) | [DIAGNOSIS.md](../runs/pilot-r1/DIAGNOSIS.md) | [FINDINGS.md](../runs/pilot-r1/FINDINGS.md) | [transcript.json](../runs/pilot-r1/transcript.json) | [p2](../runs/pilot-r1/p2-result.json), [p6](../runs/pilot-r1/p6-result.json), [p7](../runs/pilot-r1/p7-result.json), [p8](../runs/pilot-r1/p8-result.json), [q4](../runs/pilot-r1/q4-result.json), [q8](../runs/pilot-r1/q8-result.json) |
| pilot-r2 | [AGENTS.md](../runs/pilot-r2/AGENTS.md) | [DIAGNOSIS.md](../runs/pilot-r2/DIAGNOSIS.md) | [FINDINGS.md](../runs/pilot-r2/FINDINGS.md) | [transcript.json](../runs/pilot-r2/transcript.json) | [p6](../runs/pilot-r2/p6-result.json), [p7](../runs/pilot-r2/p7-result.json), [p8](../runs/pilot-r2/p8-result.json), [q4](../runs/pilot-r2/q4-result.json), [q8](../runs/pilot-r2/q8-result.json) |
| pilot-r3 | [AGENTS.md](../runs/pilot-r3/AGENTS.md) | [DIAGNOSIS.md](../runs/pilot-r3/DIAGNOSIS.md) | [FINDINGS.md](../runs/pilot-r3/FINDINGS.md) | [transcript.json](../runs/pilot-r3/transcript.json) | [p6](../runs/pilot-r3/p6-result.json), [p7](../runs/pilot-r3/p7-result.json), [p8](../runs/pilot-r3/p8-result.json), [q4](../runs/pilot-r3/q4-result.json), [q8](../runs/pilot-r3/q8-result.json) |
| pilot-r4 | [AGENTS.md](../runs/pilot-r4/AGENTS.md) | neuvedeno | [FINDINGS.md](../runs/pilot-r4/FINDINGS.md) | [transcript.json](../runs/pilot-r4/transcript.json) | [p6](../runs/pilot-r4/p6-result.json), [p7](../runs/pilot-r4/p7-result.json), [p8](../runs/pilot-r4/p8-result.json), [q4](../runs/pilot-r4/q4-result.json), [q8](../runs/pilot-r4/q8-result.json) |
| pilot-r5 | [AGENTS.md](../runs/pilot-r5/AGENTS.md) | neuvedeno | [FINDINGS.md](../runs/pilot-r5/FINDINGS.md) | [transcript.json](../runs/pilot-r5/transcript.json) | [p6](../runs/pilot-r5/p6-result.json), [p7](../runs/pilot-r5/p7-result.json), [p8](../runs/pilot-r5/p8-result.json), [q4](../runs/pilot-r5/q4-result.json), [q8](../runs/pilot-r5/q8-result.json) |

## Ablační běhy

| Běh | Instrukce | Výstupy | Judge výsledky |
| --- | --- | --- | --- |
| ablace-a-1 | [AGENTS.md](../runs/ablace-a-1/AGENTS.md) | [FINDINGS.md](../runs/ablace-a-1/FINDINGS.md) | [p6](../runs/ablace-a-1/p6-result.json), [p7](../runs/ablace-a-1/p7-result.json), [p8](../runs/ablace-a-1/p8-result.json), [q4](../runs/ablace-a-1/q4-result.json), [q8](../runs/ablace-a-1/q8-result.json) |
| ablace-a-2 | [AGENTS.md](../runs/ablace-a-2/AGENTS.md) | [FINDINGS.md](../runs/ablace-a-2/FINDINGS.md) | [p6](../runs/ablace-a-2/p6-result.json), [p7](../runs/ablace-a-2/p7-result.json), [p8](../runs/ablace-a-2/p8-result.json), [q4](../runs/ablace-a-2/q4-result.json), [q8](../runs/ablace-a-2/q8-result.json) |
| ablace-b-1 | [AGENTS.md](../runs/ablace-b-1/AGENTS.md) | [FINDINGS.md](../runs/ablace-b-1/FINDINGS.md) | [p6](../runs/ablace-b-1/p6-result.json), [p7](../runs/ablace-b-1/p7-result.json), [p8](../runs/ablace-b-1/p8-result.json), [q4](../runs/ablace-b-1/q4-result.json), [q8](../runs/ablace-b-1/q8-result.json) |
| ablace-b-2 | [AGENTS.md](../runs/ablace-b-2/AGENTS.md) | [FINDINGS.md](../runs/ablace-b-2/FINDINGS.md) | [p6](../runs/ablace-b-2/p6-result.json), [p7](../runs/ablace-b-2/p7-result.json), [p8](../runs/ablace-b-2/p8-result.json), [q4](../runs/ablace-b-2/q4-result.json), [q8](../runs/ablace-b-2/q8-result.json) |

## Souhrnné podklady

- [Souhrn běhů](../runs/SUMMARY.md)
- [Konfigurace měření](../infra/config/config.json)
- [ESLint konfigurace pro měření Q5/Q7](../infra/config/eslint-fixed.config.mjs)
