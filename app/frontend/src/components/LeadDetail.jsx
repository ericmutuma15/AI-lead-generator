import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = import.meta.env.PROD ? '/_/backend' : '/api'
const BUSINESS_ID = 'biz1'

function LeadDetail() {
  const { leadId } = useParams()
  const [lead, setLead] = useState(null)
  const [messages, setMessages] = useState([])
  const [interaction, setInteraction] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const leadRes = await fetch(`${API_BASE}/leads?business_id=${BUSINESS_ID}`)
        const leads = await leadRes.json()
        const currentLead = leads.find(l => l.id === parseInt(leadId))
        setLead(currentLead)

        if (currentLead) {
          const msgRes = await fetch(`${API_BASE}/leads/${leadId}/messages?business_id=${BUSINESS_ID}`)
          const msgs = await msgRes.json()
          setMessages(msgs)

          const interRes = await fetch(`${API_BASE}/leads/${leadId}/interaction?business_id=${BUSINESS_ID}`)
          const inter = await interRes.json()
          setInteraction(inter)
        }
      } catch (err) {
        console.error('Failed to fetch lead details:', err)
      }
      setLoading(false)
    }

    fetchData()
  }, [leadId])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await fetch(`${API_BASE}/leads/${leadId}/messages?business_id=${BUSINESS_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage, sender: 'business' }),
      })
      setNewMessage('')
      const msgRes = await fetch(`${API_BASE}/leads/${leadId}/messages?business_id=${BUSINESS_ID}`)
      const msgs = await msgRes.json()
      setMessages(msgs)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading...</div>
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <Link to="/" className="text-cyan-400 hover:text-cyan-300">← Back to dashboard</Link>
        <p className="mt-4">Lead not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex text-cyan-400 hover:text-cyan-300 transition mb-6">← Back to dashboard</Link>

        <div className="rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10 mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-2 text-xl font-semibold text-white">{lead.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Phone</p>
              <p className="mt-2 text-xl font-semibold text-white">{lead.phone}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Interest</p>
              <p className="mt-2 text-xl font-semibold text-white">{lead.interest}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <p className="mt-2 text-xl font-semibold text-white">{lead.status}</p>
            </div>
            {lead.budget && (
              <div>
                <p className="text-sm text-slate-400">Budget</p>
                <p className="mt-2 text-xl font-semibold text-white">{lead.budget}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-400">Source</p>
              <p className="mt-2 text-xl font-semibold text-white">{lead.source}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Conversation</h2>

          <div className="mb-6 max-h-96 overflow-y-auto space-y-3 rounded-[1.5rem] bg-slate-950/70 p-4">
            {messages.length === 0 ? (
              <p className="text-slate-500">No messages yet</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-[1rem] p-4 ${
                    msg.sender === 'business' ? 'bg-cyan-500/20 ml-4 ring-1 ring-cyan-300/30' : 'bg-slate-800/80 mr-4 ring-1 ring-white/10'
                  }`}
                >
                  <p className="text-xs text-slate-400 mb-1">{msg.sender === 'business' ? 'You' : lead.name}</p>
                  <p className="text-slate-100">{msg.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(msg.timestamp).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
                  </p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>

        {interaction && (
          <div className="mt-6 rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Interaction</h3>
            <div className="space-y-2 text-slate-300">
              <p>
                <span className="text-slate-400">Last contacted:</span>{' '}
                {interaction.last_contacted ? new Date(interaction.last_contacted).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) : 'N/A'}
              </p>
              <p>
                <span className="text-slate-400">Follow-up needed:</span> {interaction.follow_up_needed ? '✓ Yes' : '✗ No'}
              </p>
              <p>
                <span className="text-slate-400">Follow-up sent:</span>{' '}
                {interaction.follow_up_sent ? new Date(interaction.follow_up_sent).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }) : 'Not yet'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadDetail
