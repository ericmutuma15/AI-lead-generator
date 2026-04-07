import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LeadCaptureForm from './components/LeadCaptureForm'
import LeadDashboard from './components/LeadDashboard'
import LeadTable from './components/LeadTable'
import LeadDetail from './components/LeadDetail'

const API_BASE = import.meta.env.PROD ? '/_/backend' : '/api'
const BUSINESS_ID = 'biz1' // In production, get from auth or config

function Dashboard() {
  const [leads, setLeads] = useState([])
  const [insights, setInsights] = useState({})

  const refreshData = () => {
    fetch(`${API_BASE}/leads?business_id=${BUSINESS_ID}`)
      .then(res => res.json())
      .then(setLeads)

    fetch(`${API_BASE}/insights?business_id=${BUSINESS_ID}`)
      .then(res => res.json())
      .then(setInsights)
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 w-full">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl ring-1 ring-white/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">AI Lead Platform</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Lead Capture & Insights
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                View business leads, statuses, and interest trends with a clean, modern dashboard.
              </p>
            </div>
            <Link
              to="/capture"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Capture a lead
            </Link>
          </div>
        </header>

        <main className="space-y-6">
          <LeadDashboard insights={insights} leads={leads} />
          <LeadTable leads={leads} />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/capture" element={<LeadCaptureForm />} />
        <Route path="/leads/:leadId" element={<LeadDetail />} />
      </Routes>
    </Router>
  )
}

export default App
