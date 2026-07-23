import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiMenu, FiBell, FiSettings, FiChevronDown, FiMoon, FiSun, FiPlus, FiCommand } from "react-icons/fi";

import Avatar from "../ui/Avatar";
import Dropdown from "../ui/Dropdown";
import SearchBar from "../ui/SearchBar";
import { useAuth } from "../../contexts/AuthContext";

const pageTitles = {
  "/": { title: "Dashboard", subtitle: "Monitor leads, conversions, and revenue signals" },
  "/leads": { title: "Leads", subtitle: "Manage your pipeline and follow-ups" },
  "/capture": { title: "Capture Lead", subtitle: "Create and qualify a new lead" },
  "/analytics": { title: "Analytics", subtitle: "Business performance and conversion insights" },
  "/settings": { title: "Settings", subtitle: "Customize your workspace" },
};

export default function Topbar({ onMenuClick, search = "", onSearch = () => {} }) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [notifications] = useState(3);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") === "dark" ? "dark" : "light");
  const page = pageTitles[location.pathname] || { title: "AI Lead Generator", subtitle: "Smart CRM Platform" };

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.remove("dark");
    if (isDark) document.documentElement.classList.add("dark");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onMenuClick} className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden" aria-label="Open menu">
            <FiMenu size={20} />
          </button>

          <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-bold text-white shadow lg:flex">
            AI
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">{page.title}</h1>
            <p className="hidden truncate text-sm text-slate-500 dark:text-slate-400 md:block">{page.subtitle}</p>
          </div>
        </div>

        <div className="hidden flex-1 justify-center px-4 lg:flex">
          <div className="relative w-full max-w-xl">
            <SearchBar value={search} onSearch={onSearch} placeholder="Search leads, companies, emails..." />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <FiCommand size={11} /> K
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/capture" className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 md:flex">
            <FiPlus size={16} /> New Lead
          </Link>

          <button
            type="button"
            onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
            className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <button className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100" aria-label="Notifications">
            <FiBell size={18} />
            {notifications > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{notifications}</span>}
          </button>

          <Link to="/settings" className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100" aria-label="Settings">
            <FiSettings size={18} />
          </Link>

          <Dropdown trigger={<button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition hover:border-blue-300 hover:shadow">
            <Avatar name="Eric Mutuma" size="md" />
            <div className="hidden text-left xl:block">
              <p className="text-sm font-semibold text-slate-800">{user?.full_name || "Workspace User"}</p>
              <p className="text-xs text-slate-500">{user?.role || "User"}</p>
            </div>
            <FiChevronDown className="text-slate-500" />
          </button>}>
            <Link to="/settings" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Account Settings</Link>
            <Link to="/analytics" className="block rounded-lg px-3 py-2 hover:bg-slate-100">Analytics</Link>
            <hr className="my-2" />
            <button onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50">Logout</button>
          </Dropdown>
        </div>
      </div>

      <div className="border-t border-slate-100 p-3 dark:border-slate-800 lg:hidden">
        <SearchBar value={search} onSearch={onSearch} placeholder="Search..." />
      </div>
    </header>
  );
}
