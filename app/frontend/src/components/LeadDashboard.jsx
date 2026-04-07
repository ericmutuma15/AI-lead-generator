import Analytics from './Analytics'

function LeadDashboard({ insights, leads }) {
  return (
    <>
      <section className="rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 ring-1 ring-white/10 backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Overview</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Lead Snapshot</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Total leads', value: insights.totalLeads ?? 0 },
            { label: 'New', value: insights.statusCounts?.New ?? 0 },
            { label: 'Qualified', value: insights.statusCounts?.Qualified ?? 0 },
            { label: 'Converted', value: insights.statusCounts?.Converted ?? 0 },
            { label: 'Conversion rate', value: `${insights.conversionRate ?? 0}%` },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.5rem] bg-slate-950/70 p-5 ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-slate-900/90">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] bg-slate-950/70 p-5 ring-1 ring-white/10">
          <h3 className="text-lg font-semibold text-white">Top interests</h3>
          <ul className="mt-4 space-y-2 text-slate-300">
            {(insights.topInterests || []).length === 0 ? (
              <li className="text-slate-500">No interests yet.</li>
            ) : (
              insights.topInterests.map((interest) => (
                <li key={interest} className="rounded-2xl bg-slate-900/70 px-4 py-3 text-sm text-slate-200 shadow-sm shadow-slate-950/30">
                  {interest}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <Analytics insights={insights} leads={leads} />
    </>
  )
}

export default LeadDashboard
