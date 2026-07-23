import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileSidebar from "./MobileSidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div data-app-shell className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.18),transparent_24%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] dark:text-slate-100">
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen">
        <aside className={`hidden lg:flex transition-all duration-300 ease-in-out ${sidebarCollapsed ? "w-24" : "w-72"}`}>
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-50 shrink-0">
            <Topbar collapsed={sidebarCollapsed} onMenuClick={() => setSidebarOpen(true)} />
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto min-h-full w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
