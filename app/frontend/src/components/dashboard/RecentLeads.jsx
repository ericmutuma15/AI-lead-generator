import { useNavigate } from "react-router-dom";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import EmptyState from "../ui/EmptyState";

import {
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";

export default function RecentLeads({
  leads = [],
  loading = false,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-40 rounded bg-slate-200"></div>

          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-slate-200"></div>

              <div className="flex-1">
                <div className="h-4 w-36 rounded bg-slate-200"></div>

                <div className="mt-2 h-3 w-28 rounded bg-slate-200"></div>
              </div>

              <div className="h-8 w-20 rounded-full bg-slate-200"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={FiUsers}
        title="No Leads Yet"
        description="Your recently captured leads will appear here."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Leads
          </h2>

          <p className="text-sm text-slate-500">
            Latest customer enquiries
          </p>
        </div>

        <button
          onClick={() => navigate("/leads")}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All

          <FiArrowRight />
        </button>
      </div>

      {/* List */}

      <div className="divide-y divide-slate-100">
        {leads.slice(0, 6).map((lead) => (
          <button
            key={lead.id}
            onClick={() =>
              navigate(`/leads/${lead.id}`)
            }
            className="
              flex
              w-full
              items-center
              gap-4
              py-4
              transition
              hover:bg-slate-50
            "
          >
            <Avatar
              name={lead.name}
              size="md"
            />

            <div className="flex-1 text-left">
              <p className="font-medium text-slate-800">
                {lead.name}
              </p>

              <p className="text-sm text-slate-500">
                {lead.interest}
              </p>
            </div>

            <Badge status={lead.status} />

            <span className="hidden text-xs text-slate-400 lg:block">
              {new Date(
                lead.created_at
              ).toLocaleDateString()}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}