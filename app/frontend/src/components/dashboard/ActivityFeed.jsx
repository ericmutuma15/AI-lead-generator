import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

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

export default function ActivityFeed({
  activities = [],
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

  if (!activities.length) {
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

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />

        <div className="space-y-6">
          {activities.map((activity) => (
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
    </Card>
  );
}