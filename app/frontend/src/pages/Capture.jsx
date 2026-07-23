import { useState } from "react";
import { FiCheckCircle, FiUserPlus, FiArrowRight, FiStar } from "react-icons/fi";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { createLead } from "../services/leads";

const steps = ["Contact", "Intent", "Review"];

export default function Capture() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: "", budget: "", source: "Web" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await createLead(form);
      setMessage("Lead captured successfully. You can continue adding more prospects.");
      setStep(2);
      setForm({ name: "", phone: "", email: "", interest: "", budget: "", source: "Web" });
    } catch (error) {
      setMessage(error.message || "Unable to capture the lead right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Capture Lead" subtitle="Create a polished, qualifying lead record in seconds" />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 px-6 py-5">
          {steps.map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${index <= step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                {index + 1}
              </div>
              <span className="text-sm font-medium text-slate-700">{item}</span>
              {index < steps.length - 1 && <span className="text-slate-300">→</span>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <div className="flex items-center gap-2"><FiCheckCircle /> {message}</div>
            </div>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Full name</span>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white" placeholder="Alicia Gomez" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white" placeholder="+254 700 000000" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white" placeholder="hello@company.com" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Source</span>
              <select name="source" value={form.source} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white">
                <option value="Web">Web</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="space-y-2 text-sm lg:col-span-2">
              <span className="font-medium text-slate-700">Interest</span>
              <input name="interest" value={form.interest} onChange={handleChange} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white" placeholder="Enterprise AI automation" />
            </label>
            <label className="space-y-2 text-sm lg:col-span-2">
              <span className="font-medium text-slate-700">Budget</span>
              <input name="budget" value={form.budget} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white" placeholder="KES 500,000" />
            </label>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600"><FiStar /></div>
              <p>AI-assisted lead capture is ready for your next conversation.</p>
            </div>
            <Button type="submit" loading={loading} icon={<FiUserPlus />}>Save Lead</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
