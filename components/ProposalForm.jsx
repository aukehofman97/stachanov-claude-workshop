'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import GrantCard from './GrantCard'

export default function ProposalForm() {
  const [proposal, setProposal] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleAnalyze() {
    if (!proposal.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Analysis failed. Please try again.')
      } else {
        setResults(data)
      }
    } catch {
      setError('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-5">
        <label
          htmlFor="proposal"
          className="block text-xs font-medium text-[#64748B] uppercase tracking-wide mb-2"
        >
          Project proposal
        </label>
        <textarea
          id="proposal"
          rows={8}
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Describe your project, team, activities, and funding needs…"
          className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent resize-none"
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !proposal.trim()}
        className="inline-flex items-center gap-2 bg-[#003366] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#002855] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Analysing…
          </>
        ) : (
          'Analyze'
        )}
      </button>

      {error && (
        <p className="mt-3 text-sm text-[#DC2626]">{error}</p>
      )}

      {results && (
        <div className="mt-10">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide mb-4">
            {results.length} grant{results.length !== 1 ? 's' : ''} scored
          </p>
          <div className="space-y-4">
            {results.map((r, i) => (
              <GrantCard
                key={r.grantId}
                grantName={r.grantName}
                matchScore={r.matchScore}
                matchedCriterion={r.matchedCriterion}
                recommendation={r.recommendation}
                index={i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
