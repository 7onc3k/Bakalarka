# Controlled Experiments on Scaffolding Instructions for AI Coding Agents

## Why this question is empirically non-trivial in 2023–2026 agent research

Your experimental setup isolates *instruction-file content* as the only intended treatment. That maps closely onto what recent research calls “repository-level context files” (e.g., AGENTS.md / CLAUDE.md / copilot-instructions.md) and (more broadly) “agentic scaffolding” that shapes tool-use, workflow, and verification behavior. Two things make this scientifically interesting rather than obvious.

First, the best evidence in 2023–2026 shows that “more guidance” is not monotonic: guidance can reduce cost, or increase it, and it can increase exploration while still *reducing* task success. A 2026 paired study of entity["company","OpenAI","ai company"] Codex runs on real pull-request tasks finds that simply *having* a root AGENTS.md is associated with materially lower time-to-completion and lower output-token usage (median wall-clock −28.64%; median output tokens −16.58% in their dataset), while not attempting to claim a full correctness evaluation. citeturn6view0 In contrast, a 2026 controlled evaluation across multiple coding agents and models reports that (a) LLM-generated context files tend to reduce success rates and increase inference cost (≈20%+) and steps, (b) developer-written context files sometimes raise success modestly but still increase cost, and (c) context files measurably change behavior (more tests, more traversal) and are typically followed—suggesting that “the agent ignored the context file” is usually not the explanation. citeturn8view0turn9view1turn8view1turn9view2

Second, agent performance variance and evaluation comparability are heavily influenced by “scaffolding variability” (prompting, retries, validation loops, and other harness choices). This is now an explicit concern in benchmarking work that argues SWE-bench-style results are often not comparable across different scaffolds because the measured deltas can be dominated by scaffolding choices rather than model capability. citeturn4search1

Taken together, the literature supports your thesis premise: instruction-like scaffolding *can* matter a lot, but the direction and mechanism are not settled—and that is exactly where your 3-factor experiment can be valuable. citeturn4search1turn6view0turn8view0turn9view2

## Instruction aspects with the strongest empirical evidence of affecting outcomes

The key here is to separate (a) direct evidence from *repo-level coding agents*, (b) evidence from controlled *code-generation* benchmarks (function-level or small programs), and (c) evidence transferred by analogy from *general prompt-engineering / reasoning* studies.

### Operational/tooling instructions and guardrails

**What the evidence says (direct, high quality):** In interactive, tool-using agents, instructions and constraints that shape *how tools are used* and how errors are handled can change both success and efficiency. The SWE-agent work includes ablations showing that interface-level guardrails and “how to search/edit” conventions can swing resolution rates substantially on SWE-bench Lite; for example, adding linting/guardrails to the edit action is associated with better resolution than raw editing, and some UI-like “iterative search” behaviors can be actively harmful because the agent exhaustively iterates results and burns budget. citeturn16view0

**Why it matters for AGENTS.md-style content:** A scaffolding file cannot change the agent’s tools, but it *can* prescribe tool-use conventions (e.g., “avoid exhaustive search results; prefer targeted grep patterns,” “run typecheck after edits,” “don’t repeatedly reread instructions”). The 2026 evaluation of AGENTS.md shows that mentioning tools in the context file increases their usage markedly (tools are “used almost exclusively if they are mentioned”), indicating that context-file tool instructions causally shift behavior. citeturn8view1

**Evidence quality note:** This is among the best-supported areas because it is based on controlled ablations and trace analyses in real tool-using coding agents on established benchmarks. citeturn16view0turn8view1

### Context organization and context length/placement

**What the evidence says (direct + indirect, medium to high):** Several lines of work support the claim that context management matters in long-horizon coding tasks—either via explicit context compression/memory scaffolds in agent frameworks, or via the known brittleness of long-context reading. A 2025 “agent scaffolding” paper reports large performance differences attributable to scaffolding (context management + tool-use sophistication) under controlled environments, reinforcing that “scaffold matters” independently of the backbone model. citeturn23view2turn24view0 Separately, long-context studies show models are not robust at retrieving relevant information when it is “in the middle” of long prompts; performance often follows a U-shape with better use of information at the beginning or end. citeturn17search0

**Why it matters for your design:** Instruction-file length and layout can confound both *token consumption* and *instruction adherence*. If an instruction file is long, its *position* relative to other context and the model’s “lost-in-the-middle” behavior can change the effective treatment (the agent may “have the instructions” but not *use* them). citeturn17search0turn9view1turn9view2

**Evidence quality note:** Strong indirect evidence for length/placement effects (long-context studies). Direct evidence that context content shifts agent tool usage and “thinking tokens” exists in the AGENTS.md evaluation. citeturn17search0turn9view2turn8view1

### Planning/decomposition requirements versus goal-only prompting

**What the evidence says (mostly benchmark-level, medium quality; mixed for newest models):** Multiple controlled studies on code-generation benchmarks support explicit planning or structured reasoning as helpful on average—e.g., “self-planning” prompting reports large Pass@1 gains (up to ~25% relative over direct generation and also gains over standard CoT baselines) and improved human-rated qualities. citeturn20search1 Structured intermediate reasoning tailored to code (e.g., structured chain-of-thought that uses program structures) reports measurable Pass@1 improvements and robustness to example choices. citeturn22search0turn22search1

At the same time, later evidence complicates this: a 2024–2025 empirical study on prompt-engineering techniques in software-engineering tasks finds that techniques “developed for earlier LLMs” can provide diminished benefit or even hinder performance on newer models, and that reasoning models can incur substantial extra cost without proportional gains—sometimes making simple zero-shot prompting more effective. citeturn12search0 A 2025 prompting paper argues a *concise objective-oriented* style can reach comparable or better accuracy with fewer tokens than more process-oriented prompting—suggesting “planning verbosity” is itself a trade-off. citeturn18view0turn19view0

**Why it matters for your Node/TypeScript package task:** Your task has multi-module structure (state machine + business-day logic + timeouts) and a clear acceptance-criteria spec. Planning requirements might improve architecture and reduce rework, but could also increase tokens and slow “first executable” progress (which your trace metrics will show). citeturn12search0turn20search1turn19view0

**Evidence quality note:** Strong evidence that planning helps exists for function-level benchmarks; uncertainty rises for modern agentic settings and modern reasoning models (see next section). citeturn12search0turn20search1turn9view2

### Testing strategy instructions, including TDD-style workflows

**What the evidence says (benchmark-level + agent trace-level, medium to high):** Multiple studies indicate that tests are not just evaluation—they can be an effective *instructional constraint* and debugging signal. A 2024 study on TDD for code generation reports improved success when test cases are included alongside the problem statement on established benchmarks (MBPP, HumanEval) and across different models. citeturn13search9 Related work on LLM-guided TDD workflows and “best practices” explores how tests and iterative prompting can steer generation. citeturn13search1turn13search2

But in agentic, repo-level settings, the 2026 AGENTS.md evaluation finds that context files induce *more testing and exploration* yet can still reduce success and increase cost—suggesting that “more testing” is not automatically “better outcomes” when the task is cost-constrained and instructions add requirements. citeturn8view1turn9view2

**Why it matters for mutation testing:** Your correctness metric includes mutation testing score, which makes test strategy instructions exceptionally likely to produce measurable differences. The risk is that some instructions shift effort from implementation to tests (raising mutation score) without improving correctness, or vice versa. The 2026 findings that extra requirements increase “thinking tokens” and cost are a warning sign that test-heavy instructions may impose cognitive and resource overhead that competes with implementation. citeturn9view2turn13search9

**Evidence quality note:** We have solid evidence that tests in-prompt help function-level generation, but unclear optimality for agentic repo tasks where tests also consume budget and time. citeturn13search9turn9view2

## Where the evidence is settled versus genuinely uncertain

Because you explicitly want to test uncertainty (not re-prove settled effects), it helps to partition candidate instruction aspects into three bins. The bins below reflect *empirical* status in 2023–2026, not plausibility.

### Clear evidence it helps and should likely be a fixed baseline

**Make tool execution and verification explicit, but lightweight.** Agent studies consistently show that effective tool use and verification loops are central to success in repo-level tasks; the best-performing agents treat execution output as a first-class signal and incorporate guardrails and validation. citeturn16view0turn23view2turn8view1 For your setting, a baseline instruction like “run the test suite and typecheck before finalizing” is hard to argue against scientifically; it is also aligned with how agent benchmarks operationalize success (“all tests passing”). citeturn9view1turn16view0

**Keep the instruction file short, structured, and easy to scan.** Long-context brittleness (“lost in the middle”) and instruction-following overhead (“more thinking tokens”) are well-documented risks, and they interact with any attempt to compare instruction content fairly. citeturn17search0turn9view2 Even if you test “minimal vs comprehensive” later, your baseline should avoid accidental length confounds.

### Clear evidence it often does not help or can predictably hurt

**Exhaustive, UI-like “iterate through everything” behaviors.** SWE-agent’s ablation analysis shows that an “iterative search” interaction pattern encouraged agents to inspect every match, exhausting budgets and yielding worse performance than other search designs (and in that ablation, even worse than “no search”). citeturn16view0 In instruction-file terms: strongly encouraging exhaustive enumeration (“inspect every match,” “read every file in X directory”) is plausibly harmful for budgeted agents, and there is direct evidence of this failure mode. citeturn16view0turn9view1

**Overly complex prompt-engineering rituals on advanced models.** Evidence from software-engineering prompt-technique reevaluations and prompt-technique replication work suggests that many “clever” prompt patterns (including some role/expert prompting and other reasoning rituals) are not reliably beneficial across model generations and can add cost or even reduce performance. citeturn12search0turn17search6

### Conflicting or insufficient evidence that is high-value to test

This is the set that best matches your thesis goals.

**Are repository-level instruction files helpful or harmful—and why?** Two 2026 studies reach different conclusions depending on what is measured and how tasks are constructed: one finds efficiency improvements (time/tokens) from adding AGENTS.md in PR tasks, while another finds reduced success rates and increased cost/steps (especially for LLM-generated context files) across coding agents and established benchmarks. citeturn6view0turn8view0turn9view1 This is genuine uncertainty, not just noise, because (a) both are controlled studies, and (b) they suggest different causal mechanisms (reducing exploration vs inducing unnecessary requirements). citeturn6view0turn9view2

**Planning depth and representation.** “Planning helps” is supported for many code benchmarks, but newer evidence suggests planning-like prompt engineering can lose benefit or become counterproductive on modern models, and concise objective prompting may be more token-efficient without hurting accuracy. citeturn20search1turn12search0turn19view0 For an agent building a mid-sized package from scratch, the best planning instruction style is not settled.

**Test-first versus implementation-first under realistic budgets and mutation-score evaluation.** TDD-style prompting improves solution rates in function-level studies, but repo-level agent evidence warns that “more testing/exploration” can still reduce success due to extra requirements and overhead. citeturn13search9turn9view2turn8view1 Your mutation testing score makes this particularly uncertain: instructions might trade correctness vs test strength in non-obvious ways.

## Concrete instruction pairs for the main uncertainty areas

Below are instruction *pairs* designed to be (a) copy-pastable into an AGENTS.md-like file, (b) behaviorally distinct, and (c) tightly scoped so you can keep length roughly constant across variants.

### Minimal requirements versus comprehensive “process compliance”

**Variant A: Minimal, outcome-focused guidance (low constraint density)**

```md
## Workflow
- Focus on satisfying the acceptance criteria with correct behavior.
- Use the fastest path to a working implementation.
- Run the test suite before finalizing.

## Style
- Keep the solution simple and readable.
```

**Variant B: High constraint density (process + quality gates)**

```md
## Workflow
- Follow a strict loop: plan → implement → verify.
- Create a written checklist of acceptance criteria and mark items done.
- Run tests and typecheck after each meaningful change.
- Do not proceed with failing tests; fix immediately.

## Quality gates
- Prefer explicit edge-case handling and clear error messages.
- Add comprehensive tests for boundary conditions.
```

*Rationale from evidence:* Context files can increase exploration/testing and “thinking” overhead, and unnecessary requirements can make tasks harder even when followed. citeturn8view1turn9view2turn17search0 Yet in other settings, an AGENTS.md can reduce runtime and output tokens, plausibly by reducing exploratory navigation. citeturn6view0turn6view1

### Planning artifact versus no explicit planning artifact

**Variant A: Require an explicit plan/checklist artifact**

```md
## Planning requirement
Before writing implementation code:
1) Write a short plan (max ~10 bullets) describing modules/files you will create.
2) Write a checklist of acceptance criteria and key edge cases.
Update the checklist as you go.
```

**Variant B: No plan artifact; bias toward early executability**

```md
## Planning policy
Do not write a separate plan document.
Start by creating a minimal runnable project skeleton and iterate quickly with tests.
```

*Rationale from evidence:* Planning-based prompting improves benchmark code generation in many studies, but newer software-engineering prompt-evaluations suggest complex prompting can diminish or invert gains on advanced models and impose extra cost. citeturn20search1turn12search0turn19view0

### Goal-oriented checklist versus step-by-step procedural reasoning

**Variant A: Goal-oriented objectives only**

```md
## Reasoning style
Express solutions as a small set of concrete objectives and invariants.
Avoid verbose step-by-step reasoning; keep intermediate notes minimal.
```

**Variant B: Step-by-step procedural decomposition**

```md
## Reasoning style
Derive step-by-step solution steps (pseudocode-level) before implementing.
Use the steps to guide implementation in order.
```

*Rationale from evidence:* There is evidence that (a) structured planning/structured reasoning can improve Pass@1 on code benchmarks, and (b) concise objective-style prompting can retain accuracy while reducing tokens—suggesting a real trade-off between verbosity and robustness. citeturn20search1turn22search0turn19view0

### Test-first versus implementation-first

**Variant A: Test-first (TDD-like)**

```md
## Testing workflow
For each acceptance criterion:
- Write at least one failing unit test first.
- Implement until it passes.
- Add edge-case tests before moving to the next criterion.
```

**Variant B: Implementation-first**

```md
## Testing workflow
Implement the core functionality first.
After the implementation stabilizes, write unit tests to cover acceptance criteria and edge cases.
```

*Rationale from evidence:* Including tests as constraints improves success in controlled code-generation studies, but in repo-level agent settings additional testing can increase cost/steps and still reduce success due to overhead and extra requirements. citeturn13search9turn9view1turn9view2

### Git checkpointing versus “one final commit”

(Useful because you measure git-history traces directly.)

**Variant A: Atomic commits as checkpoints**

```md
## Version control
Commit in small, logical steps:
- “scaffold project”
- “add failing tests”
- “implement feature X”
- “refactor”
Each commit should leave tests passing.
```

**Variant B: Single final commit**

```md
## Version control
Do not make intermediate commits.
Work freely and produce a single final commit when everything passes.
```

*Rationale from evidence:* Direct empirical evidence on “commit strategy instructions” is thin compared to other areas; however, the AGENTS.md evaluation shows context-file instructions are followed and shift tool usage, making this a plausible lever for process traces with low measurement ambiguity. citeturn8view1turn9view2 This is precisely the kind of under-studied but measurable dimension that fits a thesis contribution.

## Three uncertainty dimensions that best fit your six-run constraint

Given your measures (mutation score, tests passing, tokens, restarts, and git-trace process metrics) and the “we want unknowns” criterion, the most scientifically valuable trio is:

**Planning artifact requirement (plan/checklist vs none).** This targets uncertainty about whether explicit planning helps modern coding agents on medium-horizon tasks once tool execution is available, or whether it mainly adds overhead. It is also practically relevant for people writing AGENTS.md (“should I force planning?”). citeturn20search1turn12search0turn9view2

**Testing workflow order (test-first vs implementation-first).** This is likely to generate measurable shifts in both mutation score and behavioral traces (test-first vs implementation-first file creation order is one of your primary process metrics). It is not “settled” in agentic settings because more testing can also add overhead and reduce success. citeturn13search9turn9view2turn8view1

**Git checkpointing policy (atomic commits vs single final commit).** This is highly aligned with your process-quality outcomes and is comparatively under-determined by existing literature, making it novel. It is also plausibly orthogonal to the other two: you can commit frequently without TDD, and you can do TDD without committing. citeturn8view1turn9view2

Why not choose “minimal vs comprehensive AGENTS.md” as a factor? Because it is dangerously confounded with instruction length/constraint density (which you already flagged), and the 2026 evidence suggests that instruction *density* itself can drive increased steps/cost and “thinking tokens.” If you choose it, you must aggressively control length and phrasing to avoid your treatment collapsing into “long vs short.” citeturn9view2turn17search0turn6view0

## Confounds and threats to validity that can invalidate results

### Instruction length and constraint density confounds

This is the most serious internal-validity threat. If one variant is longer or more complex, it can (a) mechanically increase token consumption and (b) degrade effective use because of long-context brittleness (“lost in the middle”)—making the experiment about context mechanics rather than instruction semantics. citeturn17search0turn9view2 The 2026 evaluation also explicitly links context files to more reasoning-token consumption for some models, indicating that “extra instructions” can trigger more internal deliberation cost. citeturn9view2

Mitigation: keep variants isomorphic in length and section structure; change only the minimum wording needed to flip the binary factor.

### Task–instruction interaction and external validity

Most repo-level agent benchmarks are dominated by bug-fixing in existing Python repositories; your task is greenfield Node/TypeScript with pure-logic requirements. citeturn9view0turn16view0 Planning and TDD evidence is often based on function-level benchmarks (HumanEval/MBPP) rather than multi-file package structure, making transfer plausible but not guaranteed. citeturn20search1turn13search9 You should treat any measured effect as “for this task class” unless replicated.

Mitigation: describe your package task’s latent structure (state machine + date arithmetic + timeouts) and argue how it maps to studied categories (logic-heavy, edge-case-rich), and explicitly label generalization limits.

### Model- and harness-specific effects (including instruction brittleness)

Prompt-technique effects vary by model generation; some techniques replicate poorly or change sign across models. citeturn12search0turn17search6 In repo-level settings, the harness (retry policy, stopping rules, tool availability, context injection order) can dominate results, and benchmark work warns about scaffolding variability making comparisons unreliable if not controlled. citeturn4search1turn16view0

Mitigation: pin temperature/decoding; pin tool set; pin stop conditions; and log the full assembled prompt/context to verify instruction ordering is identical across runs.

### Infrastructure and environment noise

Agentic coding evaluations can be sensitive to environment limits (dependency installation, network, memory) such that two runs differ for reasons unrelated to instruction content. citeturn2search23

Mitigation: run in deterministic containers; preinstall dependencies; disable network if not essential; and ensure the same CPU/memory constraints across runs.

### Stochasticity with only six runs

Coding agents show meaningful run-to-run variance even under identical conditions; SWE-agent explicitly reports per-instance variability across repeated runs. citeturn16view0 With six total runs, you have limited ability to separate small main effects from noise, and essentially no ability to estimate interactions.

Mitigation: prioritize factors with likely large effect sizes (testing order is a good candidate) and use *effect sizes with uncertainty bounds* rather than binary “significant/not significant” claims. If possible within your six runs, consider allocating at least one repeated condition (a deliberate replicate) to estimate baseline variance; otherwise your confidence intervals will be largely model-assumed.

### Measurement validity for process quality

Git history is an attractive trace, but only if the agent is *actually instructed to use git in a consistent way*. Otherwise, “process quality” becomes “whether the agent happened to commit.” The 2026 context-file evaluation shows agents follow context-file instructions and that tool mentions drive tool usage, implying you can reliably induce certain behaviors (like git commits) via scaffolding—but only if you specify them. citeturn8view1turn9view2

Mitigation: if commit patterns are an outcome, enforce a minimal git policy across all conditions (e.g., “use git for commits”) and only vary the *granularity rule* (atomic vs single).