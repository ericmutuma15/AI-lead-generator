import { useMemo, useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import LeadRow from "./LeadRow";
import LeadFilters from "./LeadFilters";
import LeadPagination from "./LeadPagination";
import LeadCard from "./LeadCard";
import EmptyState from "../ui/EmptyState";
import LoadingSkeleton from "../ui/LoadingSkeleton";

export default function LeadTable({ leads = [], loading = false, filteredLeads = [], search = "", setSearch = () => {}, filters = {}, setFilters = () => {}, page = 1, setPage = () => {}, itemsPerPage = 10, setItemsPerPage = () => {}, refreshLeads, onDelete, onEdit, onMessage, onSchedule }) {
  const [view, setView] = useState("table");
  const [selected, setSelected] = useState([]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, page, itemsPerPage]);

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const clearFilters = () => {
    setFilters({ status: "All", source: "All" });
    setPage(1);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, phone, or interest" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("table")} className={`rounded-2xl p-2.5 ${view === "table" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`} aria-label="Table view"><FiList size={18} /></button>
          <button onClick={() => setView("grid")} className={`rounded-2xl p-2.5 ${view === "grid" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`} aria-label="Grid view"><FiGrid size={18} /></button>
        </div>
      </div>

      <LeadFilters filters={filters} setFilters={setFilters} onClear={clearFilters} />

      {loading ? (
        <LoadingSkeleton />
      ) : filteredLeads.length === 0 ? (
        <EmptyState title="No leads found" description="Try adjusting your search or create a new lead." />
      ) : view === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedLeads.map((lead) => <LeadCard key={lead.id} lead={lead} onMessage={onMessage} onSchedule={onSchedule} />)}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Lead</th>
                  <th className="px-5 py-4">Interest</th>
                  <th className="px-5 py-4">Source</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead) => <LeadRow key={lead.id} lead={lead} selected={selected.includes(lead.id)} onSelect={toggleSelect} onEdit={onEdit} onMessage={onMessage} onSchedule={onSchedule} onDelete={onDelete} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <LeadPagination page={page} setPage={setPage} totalItems={filteredLeads.length} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
    </section>
  );
}
