'use client'

import { useEffect, useState } from 'react'

function scoreColor(score) {
  if (score >= 80) return '#16A34A'
  if (score >= 40) return '#D97706'
  return '#DC2626'
}

function scoreLabel(score) {
  if (score >= 80) return 'Strong match'
  if (score >= 40) return 'Partial match'
  return 'Weak match'
}

export default function GrantCard({ grantName, matchScore, matchedCriterion, recommendation, index = 0 }) {
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(matchScore), 80 + index * 120)
    return () => clearTimeout(t)
  }, [matchScore, index])

  const color = scoreColor(matchScore)

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white shadow-sm p-5">
      {/* Header row: name + score */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-sm font-semibold text-[#1E293B] leading-snug">
          {grantName}
        </h3>
        <div className="shrink-0 text-right">
          <span
            className="text-xl font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {matchScore}
          </span>
          <span className="block text-[10px] font-medium mt-0.5" style={{ color }}>
            {scoreLabel(matchScore)}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1 w-full bg-[#F1F5F9] rounded-full mb-4 overflow-hidden">
        <div
          className="h-1 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${barWidth}%`, backgroundColor: color }}
        />
      </div>

      {/* Citation */}
      <p className="text-xs text-[#64748B] leading-relaxed">
        {matchedCriterion}
      </p>

      {recommendation && (
        <p className="mt-3 text-xs font-medium" style={{ color }}>
          {recommendation}
        </p>
      )}
    </div>
  )
}
