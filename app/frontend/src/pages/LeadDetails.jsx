import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiTag, FiUser, FiClock, FiActivity } from "react-icons/fi";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import { getLead } from "../services/leads";

export default function LeadDetails() {
  const { leadId } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const request = async () => {
      try {
        const data = await getLead(leadId);
        if (mounted) setLead(data);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    request();
    return () => {
      mounted = false;
    };
  }, [leadId]);

  const metaItems = useMemo(() => [
    { label: "Phone", value: lead?.phone, icon: FiPhone },
    { label: "Email", value: lead?.email, icon: FiMail },
    { label: "Source", value: lead?.source, icon: FiTag },
    { label: "Budget", value: lead?.budget, icon: FiMapPin },
  ], [lead]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading lead profile…</div>;
  }

  if (!lead) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">This lead could not be found.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={lead.name || "Lead Profile"} subtitle="View lead context and next best action" backTo="/leads" />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-6 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={lead.name} size="xl" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{lead.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{lead.interest || "Interested in your services"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge status={lead.status} />
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Priority: High</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Lead Score</p>
              <p className="mt-1 text-3xl font-semibold text-blue-600">92</p>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            {metaItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon size={16} />
                    {item.label}
                  </div>
                  <p className="mt-3 font-semibold text-slate-900">{item.value || "—"}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Assigned Team" subtitle="Current ownership" bodyClassName="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Avatar name="Eric Mutuma" size="md" />
            <div>
              <p className="font-semibold text-slate-900">Eric Mutuma</p>
              <p className="text-sm text-slate-500">Sales Lead</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500"><FiClock size={16} /> Last updated</div>
            <p className="mt-3 font-semibold text-slate-900">{lead.created_at ? new Date(lead.created_at).toLocaleString() : "Recently captured"}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Timeline" subtitle="Activity and next steps" bodyClassName="space-y-4">
          {[{ title: "Lead created", description: "Captured from the intake form", time: "10 mins ago" }, { title: "Follow-up scheduled", description: "Reminder set for tomorrow", time: "2 hrs ago" }, { title: "Interest confirmed", description: "Discussed pricing and onboarding", time: "Today" }].map((entry) => (
            <div key={entry.title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-600"><FiActivity size={18} /></div>
              <div>
                <p className="font-semibold text-slate-900">{entry.title}</p>
                <p className="mt-1 text-sm text-slate-500">{entry.description}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{entry.time}</p>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Notes" subtitle="Context for the next interaction" bodyClassName="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            This prospect is exploring enterprise automation and has shown strong intent. Suggested next step: share a tailored ROI proposal and set a discovery call.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Follow-up should be personalized around implementation timelines and budget alignment.
          </div>
        </Card>
      </div>
    </div>
  );
}
