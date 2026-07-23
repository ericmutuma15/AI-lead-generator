import { NavLink } from "react-router-dom";
import { FiGrid, FiUsers, FiPlusCircle, FiBarChart2, FiSettings, FiChevronLeft, FiChevronRight, FiCpu } from "react-icons/fi";

const menuItems = [
  { title: "Dashboard", icon: FiGrid, path: "/" },
  { title: "Leads", icon: FiUsers, path: "/leads" },
  { title: "Capture Lead", icon: FiPlusCircle, path: "/capture" },
  { title: "Analytics", icon: FiBarChart2, path: "/analytics" },
  { title: "Settings", icon: FiSettings, path: "/settings" },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <div className="flex h-screen w-full flex-col border-r border-slate-200/80 bg-white/90 shadow-[12px_0_40px_-20px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-20 items-center justify-between border-b border-slate-200/80 px-5 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
            <FiCpu size={22} />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">AI Lead Pro</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">CRM Workspace</p>
            </div>
          )}
        </div>

        <button onClick={onToggle} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Toggle sidebar">
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end={item.path === "/"}
                className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-3 py-3 font-medium transition-all duration-200 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}>
                <Icon className="flex-shrink-0" size={18} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200/80 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white">A</div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate font-semibold text-slate-900 dark:text-slate-100">Admin</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Operations Hub</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
