import { useEffect, useMemo, useState } from "react";
import { FiBarChart2, FiTrendingUp, FiUsers, FiTarget } from "react-icons/fi";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { getLeads } from "../services/leads";

const COLORS = ["#2563eb", "#14b8a6", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function Analytics() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));

  useEffect(() => {
    let mounted = true;
    const request = async () => {
      try {
        const data = await getLeads();
        if (mounted) setLeads(data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    request();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const summary = useMemo(() => {
    const total = leads.length;
    const converted = leads.filter((lead) => lead.status === "Converted").length;
    const newLeads = leads.filter((lead) => lead.status === "New").length;
    const rate = total ? Math.round((converted / total) * 100) : 0;

    const byMonth = leads.reduce((acc, lead) => {
      const month = new Date(lead.created_at || Date.now()).toLocaleString("en", { month: "short" });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const trendPoints = Object.entries(byMonth).map(([name, value]) => ({ name, value }));
    const sourceData = Object.entries(leads.reduce((acc, lead) => {
      const source = lead.source || "Unknown";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value }));

    return { total, converted, newLeads, rate, trendPoints, sourceData };
  }, [leads]);

  const statCards = [
    { title: "Total Leads", value: summary.total, icon: FiUsers, accent: "from-blue-500 to-cyan-500" },
    { title: "Conversion Rate", value: `${summary.rate}%`, icon: FiTarget, accent: "from-emerald-500 to-lime-500" },
    { title: "New Leads", value: summary.newLeads, icon: FiTrendingUp, accent: "from-violet-500 to-fuchsia-500" },
  ];

  const gridStroke = isDark ? "#334155" : "#e2e8f0";
  const axisText = isDark ? "#cbd5e1" : "#475569";
  const tooltipStyles = {
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    borderColor: isDark ? "#334155" : "#e2e8f0",
    color: isDark ? "#f8fafc" : "#0f172a",
    borderRadius: 12,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Measure performance, conversion health, and lead momentum" />

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="overflow-hidden">
              <div className={`rounded-2xl bg-gradient-to-br ${card.accent} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">{card.title}</p>
                    <p className="mt-2 text-3xl font-semibold">{card.value}</p>
                  </div>
                  <div className="rounded-2xl bg-white/20 p-3">
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card title="Weekly Growth" subtitle="Lead activity over the last few months" className="min-h-[320px]">
          <div className="h-72">
            {loading ? <div className="h-full animate-pulse rounded-2xl bg-slate-100" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.trendPoints}>
                  <defs>
                    <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: axisText }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: axisText }} />
                  <Tooltip contentStyle={tooltipStyles} />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#growth)" strokeWidth={3} name="Leads" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card title="Sources" subtitle="Lead mix by acquisition" className="min-h-[320px]">
          <div className="h-72">
            {loading ? <div className="h-full animate-pulse rounded-2xl bg-slate-100" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={summary.sourceData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={4}>
                    {summary.sourceData.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyles} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Conversion Trends" subtitle="Status progression across the funnel" className="min-h-[300px]">
          <div className="h-72">
            {loading ? <div className="h-full animate-pulse rounded-2xl bg-slate-100" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: "New", value: summary.newLeads }, { name: "Qualified", value: leads.filter((item) => item.status === "Qualified").length }, { name: "Converted", value: summary.converted }]}> 
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: axisText }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: axisText }} />
                  <Tooltip contentStyle={tooltipStyles} />
                  <Legend />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#2563eb" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card title="Focus Areas" subtitle="Opportunities to improve conversion" bodyClassName="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Engagement rate</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">84%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Follow-up velocity</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">+18%</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Warm opportunities</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">12</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
