import { FiUsers, FiUserPlus, FiCheckCircle, FiTrendingUp, FiArrowRight, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import useDashboard from "../hooks/useDashboard";
import StatsCard from "../components/dashboard/StatsCard";
import LeadChart from "../components/dashboard/LeadChart";
import RecentLeads from "../components/dashboard/RecentLeads";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import EmptyState from "../components/ui/EmptyState";
import Card from "../components/ui/Card";

export default function Dashboard() {
  const { stats, leads, loading } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-[28px] bg-slate-200" />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-80 animate-pulse rounded-[28px] bg-slate-200 xl:col-span-2" />
          <div className="h-80 animate-pulse rounded-[28px] bg-slate-200" />
        </div>
      </div>
    );
  }

  const cards = [
    { title: "Total Leads", value: stats.totalLeads ?? leads.length, icon: FiUsers, color: "blue" },
    { title: "New Leads", value: stats.statusCounts?.New ?? 0, icon: FiUserPlus, color: "cyan" },
    { title: "Converted", value: stats.statusCounts?.Converted ?? 0, icon: FiCheckCircle, color: "green" },
    { title: "Conversion Rate", value: `${stats.conversionRate ?? 0}%`, icon: FiTrendingUp, color: "purple" },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-6 text-slate-900 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
              <FiStar /> AI-assisted growth workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Your revenue pipeline is looking healthy.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">Track fresh opportunities, nurture promising leads, and keep every follow-up moving.</p>
          </div>
          <Link to="/capture" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
            Capture a lead <FiArrowRight />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <StatsCard key={card.title} {...card} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <LeadChart leads={leads} />
        </div>
        <ActivityFeed leads={leads} />
      </div>

      <div>
        {leads.length > 0 ? <RecentLeads leads={leads} /> : <EmptyState title="No leads found" description="Start capturing leads to see them here." />}
      </div>
    </div>
  );
}
