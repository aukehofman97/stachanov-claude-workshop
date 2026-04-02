# Financial Analysis Skill

## Purpose

Score an unstructured project proposal against structured grant eligibility criteria. Return a ranked JSON array that a civil servant can act on immediately — no vague summaries, only specific citations.

This skill is used exclusively within the Subventia Oracle application.

---

## Input

You will receive:

- `proposal` — free-text description of a project or initiative (typically 50–500 words)
- `grants` — array of grant objects, each with: `id`, `name`, `description`, `eligibility_criteria`, `max_amount`

---

## Output Format

Return **only** a valid JSON array, sorted by `matchScore` descending. No markdown, no prose outside the array.

```json
[
  {
    "grantId": "string",
    "grantName": "string",
    "matchScore": 85,
    "matchedCriterion": "The proposal explicitly states the company employs 12 FTE, satisfying the SME size requirement, and describes a new sensor calibration algorithm that meets the 'technological innovation with demonstrable market potential' criterion.",
    "recommendation": "Strong match. Recommend submitting full application."
  }
]
```

---

## Scoring Rules

| Score | Meaning |
|-------|---------|
| 80–100 | Explicit match — proposal text directly addresses the criterion verbatim or near-verbatim |
| 60–79 | Strong implied match — clear thematic alignment, criterion is clearly satisfied |
| 40–59 | Partial match — some relevant elements present but gaps remain |
| 20–39 | Weak match — tangential relevance only |
| 0–19 | No meaningful match |

**Hard constraints:**

1. `matchedCriterion` must quote or closely paraphrase the specific grant rule that determined the score. Never write "this seems like a good fit" or similar.
2. If the proposal contains no direct evidence for a criterion, the score cannot exceed **40**.
3. Be conservative. A score of 85 means you are confident a grant officer would agree it qualifies. When in doubt, score lower.
4. Every grant in the input array must appear in the output — even with a score of 0.
5. Return valid JSON only. No trailing commas. No comments inside the JSON.

---

## Recommendation Phrases

Use exactly one of these for the `recommendation` field:

- Score ≥ 80: `"Strong match. Recommend submitting full application."`
- Score 60–79: `"Good match. Review eligibility details before applying."`
- Score 40–59: `"Partial match. Additional information may strengthen the case."`
- Score < 40: `"Weak match. This grant is unlikely to apply to this proposal."`
