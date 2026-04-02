---
name: financial_analysis
description: |
  Scores an unstructured project proposal against structured grant eligibility criteria and returns a ranked JSON array with match scores and mandatory criterion citations.

  Use this skill whenever the user or the codebase involves: analyzing grant eligibility, scoring proposals against funding criteria, subsidy pre-screening, matching project descriptions to grant rules, or any task in the Subventia Oracle app that involves evaluating a proposal against a list of grants. Even if the user just says "analyze this proposal" or "check if we qualify" — invoke this skill.
---

# Financial Analysis Skill

## What this skill does

You receive a free-text project proposal and a list of structured grant objects. Your job is to score each grant against the proposal and return a ranked JSON array — the kind of output a civil servant can act on immediately, without reading the full proposal themselves.

This matters because false positives waste civil servants' time (unnecessary applications) and false negatives cost organisations real money (missed funding). Be honest and specific: if the match is weak, say so clearly.

## Input

You will receive:
- `proposal` — free-text description of a project or initiative (typically 50–500 words)
- `grants` — array of grant objects, each with: `id`, `name`, `description`, `eligibility_criteria`, `max_amount`

## Output

Return **only** a valid JSON array, sorted by `matchScore` descending. No markdown fences, no prose, no explanation outside the array — the API route parses this response directly.

```json
[
  {
    "grantId": "wbso",
    "grantName": "WBSO Speur- en Ontwikkelingswerk",
    "matchScore": 87,
    "matchedCriterion": "The proposal states the team consists of 3 Dutch-based software engineers developing a new sensor calibration algorithm, directly satisfying the criteria 'must employ technical staff in the Netherlands' and 'developing new software or processes'.",
    "recommendation": "Strong match. Recommend submitting full application."
  }
]
```

## Scoring

| Score | What it means |
|-------|---------------|
| 80–100 | Explicit match — the proposal text directly addresses the criterion |
| 60–79 | Strong implied match — clear thematic alignment, criterion clearly satisfied |
| 40–59 | Partial match — some relevant elements present, but gaps remain |
| 20–39 | Weak match — tangential relevance only |
| 0–19 | No meaningful match |

**Critical constraint:** If the proposal contains no direct evidence for a specific criterion, the score cannot exceed 40. Do not infer evidence that isn't there — that's the kind of optimism that sends civil servants on pointless application journeys.

## Rules for `matchedCriterion`

This field is the most important output. It must:
- Quote or closely paraphrase the **specific grant rule** that determined the score
- Reference actual text from the proposal that satisfies (or fails to satisfy) that rule
- Never use vague phrases like "this seems like a good fit", "aligns well", or "strong potential"

If the match is weak, explain what's missing: "The proposal does not mention employment in a designated region, which is a hard requirement for EFRO funding."

## Fixed recommendation phrases

Use exactly one of these — do not improvise:
- Score ≥ 80: `"Strong match. Recommend submitting full application."`
- Score 60–79: `"Good match. Review eligibility details before applying."`
- Score 40–59: `"Partial match. Additional information may strengthen the case."`
- Score < 40: `"Weak match. This grant is unlikely to apply to this proposal."`

## Coverage

Every grant in the input array must appear in the output — even grants with a score of 0. A missing grant is worse than a low score: it leaves the user with an incomplete picture.
