---
title: "AI-Assisted Development: From Implementation to Judgment"
pubDatetime: 2025-11-07T12:00:00Z
description: "Flip the ratio: 20% reviewing code, 80% strategy. AI-assisted development with 70-80% time savings on infrastructure tasks. Real metrics from production."
tags:
  - ai
  - automation
  - devops
  - goose
  - productivity
featured: true
---

Senior engineers spend 80% of time implementing, 20% deciding. This ratio is backwards. Your judgment is valuable. Your typing is not.

Traditional constraint: Exploring multiple solutions costs 3x the implementation time. Result: Ship first working approach, not best approach.

## Table of contents

## How Does AI-Assisted Development Flip the 80/20 Ratio?

AI assistants flip the ratio: 20% reviewing code, 80% applying judgment.

Critical thinking scales. Implementation doesn't. You can evaluate 3 architectural approaches in the time it takes to implement one.

Example: [Goose](https://github.com/block/goose) (open-source AI assistant) handles codebase analysis, implementation, testing, and documentation. You provide business context, architectural judgment, and approve decisions at critical gates.

![Time allocation comparison: traditional vs AI-assisted development](@/assets/images/time-allocation-comparison.png)
*Figure 1: The 80/20 flip - Traditional approach wastes expert judgment on implementation, AI-assisted approach maximizes strategic thinking*

## Real Example: Dependency Management

**Problem:** Need automated dependency updates. Bun package manager is new. Dependabot doesn't support `bun.lock` files.

**Traditional approach:**
- Research Dependabot documentation (1 hour)
- Implement configuration (30 minutes)
- Ship it
- Discover limitations in production

**AI-assisted approach:**
- Goose explores **Dependabot AND Renovate** in parallel
- Presents trade-offs with context:
  - **Dependabot:** Simple configuration, GitHub-native, manual lockfile updates (20% of PRs)
  - **Renovate:** Complex configuration (100+ lines), full automation, third-party app
- I provide business context: Solo maintainer, ~10 updates/month, simplicity over automation
- Decision: Dependabot
- Goose iterates: "Can automate lockfile updates with GitHub Actions"
- Result: Simple configuration plus full automation (best of both)

**Outcome:**
- **Time:** 15 minutes (vs. 1.5+ hours manual research and implementation)
- **Explored:** 2 alternatives with complete trade-off analysis
- **Implemented:** Configuration, documentation, automation workflow
- **Result:** Optimal solution with documented rationale

**Key insight:** AI cannot know your scale, team size, or priorities. You apply business context to technical options.

**Source:** [PR #32 - Add Dependabot for automated dependency updates](https://github.com/clouatre-labs/clouatre.ca/pull/32)

## Real Example: CI Modernization

**Problem:** `math-mcp-learning-server` had no CI workflow. Legacy tooling (mypy) was slow and unused.

### The Approach

**AI-assisted process:**
- Goose learned modern stack from previous project (`options-trading-mcp`)
- Applied pattern to new project: Ruff (linter/formatter) + uv (package manager) + pytest-cov
- I reviewed: Risk assessment, performance trade-offs, zero regressions

### The Results

**Quantifiable outcomes:**
- **Time:** ~20 minutes (reused patterns from previous project, vs. 3-4 hours typical from scratch)
- **Performance:** [10-100x faster linting](https://github.com/astral-sh/ruff) than mypy/Pylint (replaced mypy)
- **CI runtime:** 5 seconds total
- **Testing:** 67/67 tests passing, 83% coverage, zero regressions

**Key insight:** Cross-project learning. Patterns transfer automatically. AI applies knowledge from previous work to new contexts.

**Source:** [PR #52 - Add modern CI workflow](https://github.com/clouatre-labs/math-mcp-learning-server/pull/52)

## What Business Value Does AI-Assisted Development Deliver?

### Decision Quality
- **Alternatives evaluated:** 2-3 per decision (vs. 1 traditional)
- **Time to validated options:** 15 minutes to 1 hour (vs. 1.5-6 hours)
- **Architectural reversals:** Lower (better upfront analysis)

### Senior Engineer Leverage

| Metric | Traditional | AI-Assisted | Business Impact |
|--------|-------------|-------------|-----------------|
| Time allocation | 80% implement, 20% strategy | 20% review, 80% strategy | **4x leverage** on expert judgment |
| Scope per engineer | 1-2 specialties | Full stack | Eliminate specialist bottlenecks |
| Exploration cost | High (must implement) | Low (preview and abandon) | Ship best solution, not first |

*Table 1: Comparison of senior engineer time allocation and scope between traditional and AI-assisted approaches*

### Measured Time Savings
- **Dependency setup:** 15 minutes (vs. 1.5+ hours) - **83% savings**
- **CI modernization:** ~20 minutes (vs. 3-4 hours typical) - **~90% savings**
- **DNS migration:** [2 hours total](/posts/zero-downtime-dns-migration/) (vs. 4-6 hours typical manual process) - **~60% savings**

**Average: 70-80% time savings on infrastructure and DevOps tasks**

At 10 infrastructure tasks per month, this recovers ~60 hours per year per engineer—equivalent to 1.5 weeks of productive time returned to strategic work.

### Strategic Impact

| Outcome | Traditional | AI-Assisted | Business Value |
|---------|-------------|-------------|----------------|
| Engineer capability | 1-2 specialties | Full-stack scope | Eliminate specialist bottlenecks |
| Production risk | Manual review only | AI + approval gates | Governance without slowdown |
| Knowledge retention | Tribal (turnover risk) | Codified in recipes | Team continuity despite turnover |
| Onboarding time | Weeks (shadowing) | Hours (follow recipes) | Faster team scaling |

*Table 2: Strategic outcomes and business value comparison between traditional and AI-assisted workflows*

## How Do Recipes Codify Engineering Judgment?

Goose uses "recipes" (YAML workflow definitions) that codify your judgment and process:

**5-phase workflow:**
1. **ANALYZE** - Understand codebase and problem
2. **RESEARCH** - Explore 2-3 solution approaches with trade-offs
3. **PLAN** - Detailed implementation plan
4. **IMPLEMENT** - Code, tests, documentation
5. **PREPARE** - Create PR, verify branch, push

**5 mandatory STOP points:** AI proposes, you approve before proceeding.

![Recipe workflow diagram with 5 STOP gates for human approval](@/assets/images/recipe-workflow.png)
*Figure 2: Recipe workflow enforces governance through 5 mandatory approval gates - AI proposes, human judges*

**Why this matters:**
- Repeatable process (not ad-hoc prompting)
- Audit trails (every decision documented in PR history)
- Human judgment at critical gates (governance, not blind automation)
- Onboarding tool (codified expertise)

**Example recipe structure:**

```yaml file="~/.config/goose/recipes/oss-coder.yaml"
name: oss-coder
title: OSS Contribution Specialist
description: |
  Open-source contribution specialist with mandatory approval checkpoints.

instructions: |
  ## Workflow Phases (with Mandatory STOPs)
  
  ### Phase 1: ANALYZE  // [!code highlight]
  **STOP - Present to user:**
  - Repository architecture summary
  - Issue/problem statement
  - Relevant files identified
  **ASK:** "Does this analysis look correct? Should I proceed to research?"
  
  ### Phase 2: RESEARCH  // [!code highlight]
  **STOP - Present to user:**
  - 2-3 possible solution approaches
  - Trade-offs for each
  **ASK:** "Which approach do you prefer?"
  
  ### Phase 3: PLAN  // [!code highlight]
  **STOP - Present to user:**
  - Specific files to modify
  - Implementation steps
  **ASK:** "Do you approve this plan?"
  
  # ... continues through IMPLEMENT and PREPARE phases
```

*Full recipe: [oss-coder.yaml on GitHub Gist](https://gist.github.com/clouatre/11e8afc102d659420921db6fcff4409a)*

The recipe enforces branch hygiene (never push to main), conventional commits, test requirements, and approval workflow. Updated after premature upstream contribution attempt. Now requires thorough local testing before any OSS contribution.

## When Does This Approach Work?

**Works for:**
- Experienced engineers who can evaluate proposals
- Infrastructure and DevOps tasks (high complexity, infrequent)
- Exploratory work (evaluate multiple approaches)
- Teams wanting audit trails and governance
- Solo or small teams without dedicated specialists

**Doesn't work for:**
- Junior engineers without judgment to evaluate AI proposals
- Blind automation without review (defeats the purpose)
- Legacy systems where AI lacks context
- Tasks requiring instant execution (no time for review)

**Critical success factor:** You must have expertise to evaluate proposals. AI amplifies judgment, doesn't replace it.

## The Transformation

**Traditional:** Expert time is expensive → minimize exploration → ship first working solution

**AI-assisted:** Expert time focused on judgment → maximize exploration → ship best solution

**The shift:** Your role transforms from typing code to evaluating proposals. 80% implementation becomes 80% strategy.

**Why this matters for your career:** As AI handles more implementation, critical thinking and judgment become the scarce, valuable skills. Engineers who master AI-assisted workflows position themselves for the future job market—where strategic thinking, not typing speed, determines value.

For technical leaders: This amplifies your most expensive resource—expert judgment. When your bottleneck is making the right decision (not typing code), AI becomes a strategic multiplier.
