import ProposalForm from '@/components/ProposalForm'

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-[#1E293B] text-base font-semibold mb-1">
          Analyse a project proposal
        </h2>
        <p className="text-[#64748B] text-sm">
          Paste your proposal below to score it against available Dutch government grants.
        </p>
      </div>
      <ProposalForm />
    </div>
  )
}
