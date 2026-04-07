import { Link } from 'react-router-dom'

function LeadTable({ leads }) {
  return (
    <section className="rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 ring-1 ring-white/10 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Leads</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Lead list</h2>
        </div>
        <p className="text-sm text-slate-400">Click a lead to view messages and details.</p>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-slate-950/90">
            <tr>
              {['Name', 'Phone', 'Interest', 'Source', 'Status', 'Created'].map((label) => (
                <th key={label} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-slate-900/80">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t border-white/10 transition hover:bg-slate-800/80 cursor-pointer"
                >
                  <Link to={`/leads/${lead.id}`} className="contents">
                    <td className="px-6 py-4 text-slate-100 font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-slate-300">{lead.phone}</td>
                    <td className="px-6 py-4 text-slate-300">{lead.interest}</td>
                    <td className="px-6 py-4 text-slate-300">{lead.source}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'Converted' ? 'bg-emerald-500/20 text-emerald-300' :
                        lead.status === 'Qualified' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{new Date(lead.created_at).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</td>
                  </Link>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default LeadTable
