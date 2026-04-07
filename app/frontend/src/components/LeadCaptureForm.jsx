import { useState } from 'react'

const API_BASE = '/_/backend'
const BUSINESS_ID = 'biz1'

function LeadCaptureForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    interest: '',
    budget: '',
    source: 'Web',
  })
  const [feedback, setFeedback] = useState('')
  const [autoReply, setAutoReply] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback('')
    setAutoReply('')

    const response = await fetch(`${API_BASE}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, business_id: BUSINESS_ID }),
    })

    if (!response.ok) {
      setFeedback('Failed to capture the lead. Please try again.')
      return
    }

    const result = await response.json()
    setFeedback('Lead captured successfully.')
    setAutoReply(result.autoReply || '')
    setForm({ name: '', phone: '', interest: '', budget: '', source: 'Web' })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[2rem] bg-slate-900/85 p-8 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Lead capture</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Create a new lead</h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Use this page for manual capture or inbound WhatsApp-style lead data.
              </p>
            </div>

            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Back to dashboard
            </a>
          </div>
        </header>

        <section className="rounded-[2rem] bg-gradient-to-br from-slate-900/95 via-slate-950/90 to-slate-900/90 p-8 shadow-2xl shadow-cyan-500/10 ring-1 ring-white/10">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            {['name', 'phone', 'interest', 'budget'].map((field) => (
              <label key={field} className="grid gap-2 text-sm font-medium text-slate-300">
                {field === 'name' ? 'Name' : field === 'phone' ? 'Phone' : field === 'interest' ? 'Interest' : 'Budget (optional)'}
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === 'budget' ? 'e.g. KES 5,000 - 10,000' : field === 'interest' ? 'Product or service' : field === 'phone' ? '+2547xxxxxxx' : 'Customer name'}
                  required={field !== 'budget'}
                  className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>
            ))}

            <label className="grid gap-2 text-sm font-medium text-slate-300">
              Source
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
              >
                <option value="Web">Web</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Capture lead
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {feedback && <div className="rounded-3xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 ring-1 ring-emerald-300/20">{feedback}</div>}
            {autoReply && <div className="rounded-3xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200 ring-1 ring-white/10">Auto reply: {autoReply}</div>}
          </div>
        </section>
      </div>
    </div>
  )
}

export default LeadCaptureForm
