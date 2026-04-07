import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#06b6d4', '#0891b2', '#10b981', '#f59e0b', '#ef4444']

function Analytics({ insights, leads }) {
  const statusData = [
    { name: 'New', value: insights.statusCounts?.New ?? 0 },
    { name: 'Qualified', value: insights.statusCounts?.Qualified ?? 0 },
    { name: 'Converted', value: insights.statusCounts?.Converted ?? 0 },
  ]

  const interestData = (insights.topInterests || []).map((interest) => ({
    name: interest,
    count: leads.filter((l) => l.interest === interest).length,
  }))

  const sourceData = [
    { name: 'Web', value: leads.filter((l) => l.source === 'Web').length },
    { name: 'WhatsApp', value: leads.filter((l) => l.source === 'WhatsApp').length },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Lead Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {interestData.length > 0 && (
        <div className="rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Top Interests</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Lead Source Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {sourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics
