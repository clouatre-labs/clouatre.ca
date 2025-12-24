---
title: "Orchestrating AI Agents: A Subagent Architecture for Code"
pubDatetime: 2025-12-24
description: Cut AI coding costs 75% with a subagent architecture. Separate planning (Opus), building (Haiku), and validation (Sonnet) for better results with less context bloat.
tags:
  - AI
  - LLM
  - Architecture
  - Productivity
  - Goose
featured: true
---

Single-agent AI coding hits a ceiling. Context windows fill up. Role confusion creeps in. Output quality degrades. The solution: multiple specialized models with structured handoffs. One model plans, another builds, a third validates. Each starts fresh. Each excels at its role.

Basic code assistants show roughly 10% productivity gains. But companies pairing AI with end-to-end process transformation report [25-30% improvements](https://www.bain.com/insights/from-pilots-to-payoff-generative-ai-in-software-development-technology-report-2025/) (Bain, 2025). The difference isn't the model. It's the architecture.

This post documents a production workflow using [Goose](https://github.com/block/goose), an open-source AI assistant. The architecture separates planning, building, and validation into distinct phases, each with a different model optimized for the task.

## The Single-Agent Ceiling

A single AI model handling an entire coding task accumulates context with every interaction. By implementation time, the model carries baggage from analysis, research, and planning phases. This creates three problems.

**Context bloat.** Long conversations consume token budgets. The model forgets early instructions or weighs recent context too heavily. Critical requirements get lost.

**Role confusion.** A model asked to analyze, plan, implement, and validate lacks clear boundaries. It starts implementing during planning. It skips validation steps. Outputs blur together.

**Accumulated errors.** Mistakes in early phases propagate. A misunderstanding in analysis leads to a flawed plan. A flawed plan leads to incorrect implementation. Fixing requires starting over.

The business impact is measurable. Longer sessions correlate with more rework. Complex refactors that should take hours stretch into days of back-and-forth correction.

## The Subagent Solution

The fix: spawn specialized subagents for each phase. An orchestrator handles high-level coordination and human interaction. Subagents handle execution with fresh context.

![Subagent workflow diagram showing Orchestrator with ANALYZE, RESEARCH, PLAN phases flowing to Builder (BUILD) and Validator (CHECK)](@/assets/images/recipe-workflow.png)

*Figure 1: Subagent workflow. Orchestrator handles planning with human gates. Builder and Validator run as separate subagents with fresh context.*

The orchestrator (Claude Opus 4.5) handles ANALYZE, RESEARCH, and PLAN phases. These require high reasoning capability and human judgment at each gate. After plan approval, it spawns a BUILD subagent (Claude Haiku 4.5) that receives only the plan, not accumulated history. The builder writes code, runs tests, then hands off to a CHECK subagent (Claude Sonnet 4.5) for validation.

Each subagent starts with clean context. The builder knows what to build, not how we decided to build it. The validator knows what was built, not what alternatives we considered. This isolation prevents context pollution.

The pattern has broader validation: [Anthropic's Research feature](https://www.anthropic.com/engineering/multi-agent-research-system) uses similar orchestration, a LeadResearcher coordinating parallel subagents with fresh context. The principle scales across domains.

## Model Selection Strategy

Different phases need different capabilities. Planning requires reasoning. Building requires speed and instruction-following. Validation requires balanced judgment.

| Model | Role | Temperature | Rationale |
|-------|------|-------------|-----------|
| Claude Opus 4.5 | Orchestrator | 0.5 | High reasoning for analysis and planning |
| Claude Haiku 4.5 | Builder | 0.2 | Fast, cheap, precise instruction-following |
| Claude Sonnet 4.5 | Validator | 0.1 | Balanced judgment, conservative (catches issues) |

*Table 1: Model selection by phase. Temperature decreases as tasks become more deterministic.*

### Cost Optimization

The cost structure matters. Building involves the most token-heavy work: reading files, writing code, running tests. By routing this volume to cheaper models, you cut costs significantly.

| Approach | Model Mix | Est. Cost per Task |
|----------|-----------|-------------------|
| All Opus | 100% Opus | ~$3.50 |
| Recipe-based | 20% Opus, 60% Haiku, 20% Sonnet | ~$0.90 |
| **Savings** | | **~75%** |

*Table 2: Cost comparison for a typical multi-file refactor (~100K tokens). Prices based on Anthropic API pricing, December 2025.*

Opus handles the high-value planning work where reasoning matters. Haiku handles the high-volume execution work where speed matters. The savings compound across projects.

### Why Minimalist Instructions Matter

Smaller models like Haiku excel with focused, explicit prompts. Complex multi-step instructions cause drift. The recipe went through multiple iterations to find the right balance: enough context to execute correctly, minimal enough to avoid confusion. Each phase prompt fits in under 500 tokens. The builder receives a structured JSON plan, not prose. Constraints beat verbosity.

## The Handoff Protocol

Subagents communicate through JSON files in `.goose/handoff/`. This creates an explicit contract between phases.

```
.goose/handoff/
├── 02-plan.json      # Orchestrator → Builder
├── 03-build.json     # Builder → Validator  
└── 04-validation.json # Validator → Builder (on failure)
```

The plan file contains everything the builder needs:

```json file=".goose/handoff/02-plan.json"
{
  "overview": "Consolidate 4 provider clients into generic AiClient",
  "files": [
    {"path": "src/ai/client.rs", "action": "create", "description": "Generic client"},
    {"path": "src/ai/openai.rs", "action": "delete", "description": "Remove"},
    {"path": "src/ai/anthropic.rs", "action": "delete", "description": "Remove"}
  ],
  "steps": [
    "Create AiClient trait with send_message method",
    "Implement for each provider using existing logic",
    "Update mod.rs exports",
    "Run cargo test and cargo clippy"
  ],
  "test_strategy": {
    "unit": "Existing tests should pass unchanged",
    "integration": "Run aptu ai ask with each provider"
  }
}
```

*Example handoff from the aptu#272 refactor. Builder receives structured instructions, not conversation history.*

Why files instead of memory? Three reasons:

1. **Auditable.** Every decision is recorded. Debug failures by reading the handoff chain.
2. **Resumable.** Interrupt and resume without losing state. Files persist across sessions.
3. **Debuggable.** When validation fails, the validator writes specific issues to `04-validation.json`. The builder reads them on retry.

## Human Gates: Where Judgment Stays

Not every phase needs human approval. The workflow distinguishes between decisions (require judgment) and execution (follow the plan).

**Phases with gates (human approval required):**
- ANALYZE: "Is my understanding of the problem correct?"
- RESEARCH: "Which of these approaches should we take?"
- PLAN: "Does this implementation plan look right?"

**Phases without gates (auto-proceed):**
- BUILD: Execute the approved plan
- CHECK: Validate against plan requirements

This separation preserves governance without creating bottlenecks. Humans make strategic decisions. AI executes. If validation fails, the system loops back to BUILD with specific feedback. No human intervention for mechanical fixes.

The gates also create natural documentation points. Each approval is a checkpoint in the decision record.

## Results

This architecture produced three merged PRs on the [aptu](https://github.com/clouatre-labs/aptu) project:

| PR | Scope | Files Changed |
|----|-------|---------------|
| [#272](https://github.com/clouatre-labs/aptu/pull/272) | Consolidate 4 clients → 1 generic | 12 files |
| [#256](https://github.com/clouatre-labs/aptu/pull/256) | Add Groq + Cerebras providers | 8 files |
| [#253](https://github.com/clouatre-labs/aptu/pull/253) | Remote config for curated repos | 6 files |

*Table 3: PRs using subagent architecture. All passed CI, all merged without rework.*

The validation phase caught issues the builder missed. In PR #272, the CHECK subagent identified a missing trait bound that would have failed compilation. The builder fixed it on the retry loop. No human intervention required.

### Design Targets

Research on multi-agent frameworks for code generation shows they [consistently outperform single-model systems](https://arxiv.org/abs/2510.08804) (MOSAIC, 2024). The architecture is designed to achieve:

| Metric | Single Agent | Subagent Architecture |
|--------|--------------|----------------------|
| Context at build phase | ~50K tokens | ~5K tokens (fresh) |
| Rework loops | 2-3 typical | 0-1 expected |
| Human interventions | Throughout | Only at gates |

*Table 4: Design targets based on context isolation and structured handoffs.*

## When This Works (and When It Doesn't)

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
- MOSAIC: Multi-agent Orchestration for Task-Intelligent Coding (arXiv, 2024) — https://arxiv.org/abs/2510.08804
