import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiCalendar, FiArrowRight } from "react-icons/fi";
import Avatar from "../ui/Avatar";
import LeadStatusBadge from "./LeadStatusBadge";

export default function LeadCard({ lead, onMessage, onSchedule }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={lead.name} size="lg" />
          <div>
            <button onClick={() => navigate(`/leads/${lead.id}`)} className="text-left font-semibold text-slate-900 hover:text-blue-600">
              {lead.name}
            </button>
            <p className="mt-1 text-sm text-slate-500">{lead.phone || "No phone listed"}</p>
          </div>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Interest</span>
          <span className="font-medium text-slate-800">{lead.interest || "—"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Source</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{lead.source || "Unknown"}</span>
        </div>
        {lead.budget ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Budget</span>
            <span className="font-medium text-slate-800">{lead.budget}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
        <button onClick={() => onMessage?.(lead)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-50 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
          <FiMessageCircle /> Message
        </button>
        <button onClick={() => onSchedule?.(lead)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200">
          <FiCalendar />
        </button>
        <button onClick={() => navigate(`/leads/${lead.id}`)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
