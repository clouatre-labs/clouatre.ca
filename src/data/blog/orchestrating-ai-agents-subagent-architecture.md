---
title: "Orchestrating AI Agents: A Subagent Architecture for Code"
pubDatetime: 2025-12-24T12:00:00Z
description: "Cut AI coding costs 50% with multi-agent architecture. Assign planning, building, and validation to specialized models for better output at lower spend."
tags:
  - ai
  - architecture
  - goose
  - llm
  - productivity
featured: true
---

Single-agent AI coding hits a ceiling. Context windows fill up. Role confusion creeps in. Output quality degrades. The solution: multiple specialized models with structured handoffs. One model plans, another builds, a third validates. Each starts fresh. Each excels at its role.

Basic code assistants show roughly 10% productivity gains. But companies pairing AI with end-to-end process transformation report [25-30% improvements](https://www.bain.com/insights/from-pilots-to-payoff-generative-ai-in-software-development-technology-report-2025/) (Bain, 2025). The difference isn't the model. It's the architecture.

Anthropic's research on multi-agent systems confirms what we observe: architecture matters more than model choice. Their finding that ["token usage explains 80% of the variance"](https://www.anthropic.com/engineering/multi-agent-research-system) reflects the impact of isolation: focused context rather than accumulated conversation history.

This post documents a production workflow using [Goose](https://github.com/block/goose), an open-source AI assistant. The architecture separates planning, building, and validation into distinct phases, each with a different model optimized for the task.

## Table of contents

## Why Do Single-Agent AI Coding Workflows Hit a Ceiling?

A single AI model handling an entire coding task accumulates context with every interaction. By implementation time, the model carries baggage from analysis, research, and planning phases. This creates three problems.

**Context bloat.** Long conversations consume token budgets. The model forgets early instructions or weighs recent context too heavily. Critical requirements get lost.

**Role confusion.** A model asked to analyze, plan, implement, and validate lacks clear boundaries. It starts implementing during planning. It skips validation steps. Outputs blur together.

**Accumulated errors.** Mistakes in early phases propagate. A misunderstanding in analysis leads to a flawed plan. A flawed plan leads to incorrect implementation. Fixing requires starting over.

The business impact is measurable. Longer sessions correlate with more rework. Complex refactors that should take hours stretch into days of back-and-forth correction.

## How Does Subagent Architecture Solve Context Problems?

The fix: spawn specialized subagents for each phase. An orchestrator handles high-level coordination and human interaction. Subagents handle execution with fresh context.

![Subagent workflow diagram showing Orchestrator with RESEARCH, PLAN phases flowing to Builder and Validator subagents](@/assets/images/subagent-workflow.png)

*Figure 1: Core subagent workflow. Orchestrator handles RESEARCH (with human gate) and PLAN. Builder and Validator run as separate subagents with fresh context. SETUP and COMMIT/PR phases omitted for clarity.*

The orchestrator (Claude Opus 4.5) handles RESEARCH and PLAN phases. RESEARCH requires human judgment at a single gate to decide the approach. After plan completion, it spawns a BUILD subagent (Claude Haiku 4.5) that receives only the plan, not accumulated history. The builder writes code, runs tests, then hands off to a CHECK subagent (Claude Sonnet 4.5) for validation.

Each subagent starts with clean context. The builder knows what to build, not how we decided to build it. The validator knows what was built, not what alternatives we considered. This isolation prevents context pollution and drives the performance gains research attributes to architecture over model selection (Anthropic Engineering, 2025).

## Model Selection Strategy

Different phases need different capabilities. Planning requires reasoning. Building requires speed and instruction-following. Validation requires balanced judgment.

| Model | Role | Temperature | Rationale |
|-------|------|-------------|-----------|
| Opus | Orchestrator | 0.5 | High reasoning for research and planning |
| Haiku | Builder | 0.2 | Fast, cheap, precise instruction-following |
| Sonnet | Validator | 0.1 | Balanced judgment, conservative (catches issues) |

*Table 1: Model selection by phase. Temperature decreases as tasks become more deterministic.*

### Cost Optimization

Building involves the most token-heavy work: reading files, writing code, running tests. Routing this volume to cheaper models cuts costs significantly.

| Model | Input | Output | Role in Workflow |
|-------|-------|--------|------------------|
| Opus | $5/MTok | $25/MTok | Planning (~20% of tokens) |
| Sonnet | $3/MTok | $15/MTok | Validation (~20% of tokens) |
| Haiku | $1/MTok | $5/MTok | Building (~60% of tokens) |

*Table 2: Anthropic API pricing, December 2025. Building consumes the most tokens at the lowest cost.*

Research on multi-agent LLM systems shows up to 94% cost reduction through model cascading (Gandhi et al., 2025). This architecture targets 50-60% savings by routing building work to Haiku while preserving Opus for planning.

Beyond cost, fresh context enables tasks that fail with single agents. A 12-file refactor that exhausts a single model's context window succeeds when each subagent starts clean.

### Why Minimalist Instructions Matter

Smaller models like Haiku excel with focused, explicit prompts. Complex multi-step instructions cause drift. The recipe went through multiple iterations to find the right balance: enough context to execute correctly, minimal enough to avoid confusion. Each phase prompt fits in under 500 tokens. The builder receives a structured JSON plan, not prose. Constraints beat verbosity.

## The Handoff Protocol

Subagents communicate through JSON files in `$WORKTREE/.goose/handoff/`. Each session uses an isolated git worktree, so handoff files are scoped to that execution context. This creates an explicit contract between phases.

```
$WORKTREE/.goose/handoff/
├── 02-plan.json      # Orchestrator → Builder
├── 03-build.json     # Builder → Validator  
└── 04-validation.json # Validator → Builder (on failure)
```

The plan file contains everything the builder needs:

```json file=".goose/handoff/02-plan.json"
{
  "overview": "Remove 4 dead render_with_context methods",
  "files": [
    {"path": "src/output/triage.rs", "action": "modify"},
    {"path": "src/output/history.rs", "action": "modify"},
    {"path": "src/output/bulk.rs", "action": "modify"},
    {"path": "src/output/create.rs", "action": "modify"}
  ],
  "steps": [
    "Remove render_with_context impl blocks from each file",
    "Remove #[allow(dead_code)] annotations",
    "Remove unused imports",
    "Run cargo fmt && cargo clippy && cargo test"
  ],
  "risks": ["None - confirmed dead code"]
}
```

The validator reads both `02-plan.json` and `03-build.json` to verify implementation matches requirements. It writes structured feedback to `04-validation.json`:

```json file=".goose/handoff/04-validation.json"
{
  "verdict": "FAIL",
  "checks": [
    {"name": "Remove #[allow(dead_code)] annotations", "status": "FAIL",
     "notes": "Annotations still present in history.rs:145, bulk.rs:31, create.rs:63"}
  ],
  "issues": ["Plan required removing annotations, but these are still present"],
  "next_steps": "Fix issue: Remove the three annotations, then re-validate"
}
```

The builder reads this feedback, fixes the specific issues, and triggers another CHECK cycle until validation passes.

Why files instead of memory? Three reasons:

1. **Auditable.** Every decision is recorded. Debug failures by reading the handoff chain.
2. **Resumable.** Interrupt and resume without losing state. Start a new session with the same handoff files and no work is lost.
3. **Debuggable.** Failed validations include exact locations and actionable next steps.

## Quick Start

The recipe defines each phase with model-specific settings: Opus for orchestration, Haiku for building, Sonnet for validation. The full recipe (200+ lines) is available as a [GitHub Gist](https://gist.github.com/clouatre/22d4451725f3c64dabe680297bbd35d7).

## Where Should Human Judgment Stay in AI Workflows?

Not every phase needs human approval. The workflow distinguishes between decisions (require judgment) and execution (follow the plan).

**Phases with gates (human approval required):**
- RESEARCH: "Which of these approaches should we take?"
- CHECK (conditional): On FAIL or PASS WITH NOTES, human decides whether to fix issues or proceed

**Phases without gates (auto-proceed):**
- SETUP: Initialize context and gather requirements
- PLAN: Design solution based on approved research direction
- BUILD: Execute the approved plan
- CHECK (on PASS): Validation passed, proceed to commit
- COMMIT/PR: Push validated changes

This separation preserves governance without creating bottlenecks. Humans make strategic decisions. AI executes. If validation fails, the system loops back to BUILD with specific feedback. No human intervention for mechanical fixes.

The gates also create natural documentation points. Each approval is a checkpoint in the decision record.

## Results

This architecture powers development across multiple projects. Three examples from [aptu](https://github.com/clouatre-labs/aptu):

| PR | Scope | Files Changed |
|----|-------|---------------|
| [#272](https://github.com/clouatre-labs/aptu/pull/272) | Consolidate 4 clients → 1 generic | 12 files |
| [#256](https://github.com/clouatre-labs/aptu/pull/256) | Add Groq + Cerebras providers | 8 files |
| [#244](https://github.com/clouatre-labs/aptu/pull/244) | Extract shared AiProvider trait | 9 files |

*Table 3: Representative PRs using subagent architecture. All passed CI, all merged without rework.*

The validation phase caught issues the builder missed. In PR #272, the CHECK subagent identified a missing trait bound that would have failed compilation. The builder fixed it on the retry loop. No human intervention required.

### Design Targets

Research on multi-agent frameworks for code generation shows they [consistently outperform single-model systems](https://arxiv.org/abs/2510.08804) (Raghavan & Mallick, 2025). The architecture is designed to achieve:

| Metric | Single Agent | Subagent Architecture |
|--------|--------------|----------------------|
| Context at build phase | ~50K tokens | ~5K tokens (fresh) |
| Rework loops | 2-3 typical | 0-1 expected |
| Human interventions | Throughout | Only at gates |

*Table 4: Design targets based on context isolation and structured handoffs.*

## When Does This Work (and When Doesn't It)?

**Works well for:**
- Multi-file refactors where context isolation prevents confusion
- Feature additions following established patterns
- Complex changes requiring distinct planning and execution
- Teams wanting audit trails (handoff files document decisions)

**Less effective for:**
- Simple one-file fixes (overhead exceeds benefit)
- Legacy systems without clear patterns (builder lacks context)
- Exploratory work where plans change during implementation

The overhead of spawning subagents and writing handoff files adds 2-3 minutes per task. For a 10-minute fix, that's significant. For a 2-hour refactor, it's negligible, and the quality improvement justifies it.

## Takeaways

1. **Separate reasoning from execution.** Use capable models for planning, fast models for building.
2. **Fresh context beats accumulated context.** Subagents start clean. They follow instructions without historical baggage.
3. **Structured handoffs create audit trails.** JSON files document what was planned, built, and validated.
4. **Gates at decisions, not execution.** Human judgment for strategy. Automated loops for implementation.

The full recipe is available as a [GitHub Gist](https://gist.github.com/clouatre/22d4451725f3c64dabe680297bbd35d7). It builds on patterns from [AI-Assisted Development: From Implementation to Judgment](/posts/ai-assisted-development-judgment-over-implementation/).

For technical leaders: Multi-agent orchestration is the next step after single-agent productivity gains. When context management becomes your bottleneck, subagents provide the isolation that scales.

---

## References

- Bain & Company, "From Pilots to Payoff: Generative AI in Software Development" (2025) — https://www.bain.com/insights/from-pilots-to-payoff-generative-ai-in-software-development-technology-report-2025/
- Anthropic Engineering, "How we built our multi-agent research system" (2025) — https://www.anthropic.com/engineering/multi-agent-research-system
- Gandhi et al., "BudgetMLAgent: A Cost-Effective LLM Multi-Agent System" (2025) — https://arxiv.org/abs/2411.07464
- Raghavan & Mallick, "MOSAIC: Multi-agent Orchestration for Task-Intelligent Scientific Coding" (2025) — https://arxiv.org/abs/2510.08804
