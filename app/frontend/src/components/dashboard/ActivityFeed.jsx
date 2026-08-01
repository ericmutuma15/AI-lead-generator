import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  FiActivity,
  FiUserPlus,
  FiMessageCircle,
  FiCheckCircle,
  FiPhoneCall,
  FiEdit3,
} from "react-icons/fi";

const eventIcons = {
  lead_created: <FiUserPlus className="text-blue-600" />,
  message_received: <FiMessageCircle className="text-indigo-600" />,
  lead_converted: <FiCheckCircle className="text-emerald-600" />,
  follow_up: <FiPhoneCall className="text-amber-600" />,
  lead_updated: <FiEdit3 className="text-violet-600" />,
};

const eventColors = {
  lead_created: "bg-blue-100",
  message_received: "bg-indigo-100",
  lead_converted: "bg-emerald-100",
  follow_up: "bg-amber-100",
  lead_updated: "bg-violet-100",
};

function normalizeActivity(activity) {
  if (!activity) {
    return null;
  }

  const timestamp = activity.time || activity.created_at || activity.timestamp || activity.date;

  return {
    id: activity.id ?? `${activity.title || "activity"}-${timestamp || Date.now()}`,
    type: activity.type ?? "lead_created",
    title: activity.title ?? "Lead activity",
    description: activity.description ?? activity.message ?? "Activity recorded",
    time: timestamp,
  };
}

export default function ActivityFeed({
  activities = [],
  leads = [],
  loading = false,
}) {
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-40 rounded bg-slate-200"></div>

          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4"
            >
              <div className="h-10 w-10 rounded-full bg-slate-200"></div>

              <div className="flex-1">
                <div className="h-4 w-52 rounded bg-slate-200"></div>

                <div className="mt-2 h-3 w-24 rounded bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const normalizedActivities = (activities || [])
    .map(normalizeActivity)
    .filter(Boolean);

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const insightData = Object.values(
    leads.reduce((acc, lead) => {
      const month = new Date(lead.created_at || Date.now()).toLocaleString("en", { month: "short" });
      if (!acc[month]) {
        acc[month] = { name: month, New: 0, Qualified: 0, Converted: 0 };
      }

      if (lead.status === "New") {
        acc[month].New += 1;
      } else if (lead.status === "Qualified") {
        acc[month].Qualified += 1;
      } else if (lead.status === "Converted") {
        acc[month].Converted += 1;
      }

      return acc;
    }, {}),
  ).sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

  if (!normalizedActivities.length) {
    return (
      <EmptyState
        icon={FiActivity}
        title="No Recent Activity"
        description="Business activity will appear here as leads are captured and managed."
      />
    );
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Activity
        </h2>

        <p className="text-sm text-slate-500">
          Latest updates across your business
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-6">
            {normalizedActivities.map((activity) => (
              <div
                key={activity.id}
                className="relative flex gap-4"
              >
                <div
                  className={`
                    relative
                    z-10
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    ${eventColors[activity.type] || "bg-slate-100"}
                  `}
                >
                  {eventIcons[activity.type] || (
                    <FiActivity className="text-slate-600" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium text-slate-800">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(activity.time).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-800">
              Lead insight
            </p>
            <p className="text-xs text-slate-500">
              Pipeline health at a glance
            </p>
          </div>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insightData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="New" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 2 }} name="New" />
                <Line type="monotone" dataKey="Qualified" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 2 }} name="Qualified" />
                <Line type="monotone" dataKey="Converted" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 2 }} name="Converted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}