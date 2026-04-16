import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import getDb from '@/lib/db'

const client = new Anthropic()

export async function POST(request) {
  const body = await request.json()
  const proposal = body?.proposal?.trim()

  if (!proposal) {
    return NextResponse.json({ error: 'proposal is required' }, { status: 400 })
  }

  // Synchronous — no await on DB calls
  const db = getDb()
  const grants = db.prepare('SELECT * FROM grants').all()

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are a grant eligibility analyst. Score the proposal below against each grant using these rules:

SCORING:
- 80–100: Explicit match — proposal text directly addresses the criterion
- 60–79: Strong implied match — clear thematic alignment, criterion clearly satisfied
- 40–59: Partial match — some relevant elements present, but gaps remain
- 20–39: Weak match — tangential relevance only
- 0–19: No meaningful match
- CRITICAL: If the proposal contains no direct evidence for a criterion, score cannot exceed 40

RULES FOR matchedCriterion:
- Quote or closely paraphrase the specific grant rule that determined the score
- Reference actual text from the proposal that satisfies or fails to satisfy that rule
- Never use vague phrases like "aligns well" or "strong potential"
- If match is weak, explain what's missing

RECOMMENDATION (use exactly one):
- Score ≥ 80: "Strong match. Recommend submitting full application."
- Score 60–79: "Good match. Review eligibility details before applying."
- Score 40–59: "Partial match. Additional information may strengthen the case."
- Score < 40: "Weak match. This grant is unlikely to apply to this proposal."

Every grant in the input MUST appear in the output — even grants with score 0.

Return ONLY a valid JSON array sorted by matchScore descending. No markdown fences, no prose outside the array.

Each element MUST use exactly these field names:
{
  "grantId": <id from input>,
  "grantName": <name from input>,
  "matchScore": <integer 0-100>,
  "matchedCriterion": <one sentence citing the specific criterion and proposal evidence>,
  "recommendation": <one of the fixed phrases above>
}

PROPOSAL:
${proposal}

GRANTS:
${JSON.stringify(grants, null, 2)}`,
        },
      ],
    })

    const text = message.content[0].text
    const json = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const results = JSON.parse(json)

    return NextResponse.json(results)
  } catch {
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
