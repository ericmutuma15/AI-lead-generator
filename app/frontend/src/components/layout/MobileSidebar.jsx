import { NavLink } from "react-router-dom";
import {
  FiX,
  FiGrid,
  FiUsers,
  FiPlusCircle,
  FiBarChart2,
  FiSettings,
  FiCpu,
} from "react-icons/fi";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: FiGrid,
  },
  {
    title: "Leads",
    path: "/leads",
    icon: FiUsers,
  },
  {
    title: "Capture Lead",
    path: "/capture",
    icon: FiPlusCircle,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: FiBarChart2,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: FiSettings,
  },
];

export default function MobileSidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300
          ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen
          w-72
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <FiCpu size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                AI Lead Pro
              </h2>

              <p className="text-xs text-slate-500">
                CRM Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    flex items-center gap-4 rounded-2xl px-4 py-3
                    transition-all duration-200 font-medium
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-700 hover:bg-slate-100"
                    }
                  `
                }
              >
                <Icon size={20} />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="font-semibold text-slate-900">
              AI Lead Platform
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Smart lead management powered by AI.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}