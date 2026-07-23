import {
  FiPlus,
  FiDownload,
  FiUpload,
  FiMessageCircle,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import Card from "../ui/Card";

const actions = [
  {
    title: "New Lead",
    icon: FiPlus,
    to: "/capture",
    color: "bg-blue-500",
  },
  {
    title: "Import",
    icon: FiUpload,
    to: "#",
    color: "bg-emerald-500",
  },
  {
    title: "Export",
    icon: FiDownload,
    to: "#",
    color: "bg-amber-500",
  },
  {
    title: "Campaign",
    icon: FiMessageCircle,
    to: "#",
    color: "bg-violet-500",
  },
];

export default function QuickActions() {
  return (
    <Card>

      <div className="mb-6">

        <h2 className="text-lg font-semibold">
          Quick Actions
        </h2>

        <p className="text-sm text-slate-500">
          Frequently used shortcuts.
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.to}
              className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white ${action.color}`}
              >
                <Icon size={20} />
              </div>

              <h3 className="font-semibold">
                {action.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Open
              </p>
            </Link>
          );
        })}

      </div>

    </Card>
  );
}