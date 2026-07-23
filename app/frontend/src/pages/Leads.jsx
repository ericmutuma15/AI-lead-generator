import { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import LeadTable from "../components/leads/LeadTable";
import LeadModal from "../components/leads/LeadModal";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { getLeads, deleteLead } from "../services/leads";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "All", source: "All" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data || []);
    } catch (error) {
      console.error("Failed loading leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchMatch = lead.name?.toLowerCase().includes(search.toLowerCase()) || lead.phone?.includes(search) || lead.email?.toLowerCase().includes(search.toLowerCase());
      const statusMatch = filters.status === "All" || lead.status === filters.status;
      const sourceMatch = filters.source === "All" || lead.source === filters.source;
      return searchMatch && statusMatch && sourceMatch;
    });
  }, [leads, search, filters]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, page, itemsPerPage]);

  const handleDelete = async (lead) => {
    const confirmDelete = window.confirm(`Delete ${lead.name}?`);
    if (!confirmDelete) return;
    try {
      await deleteLead(lead.id);
      loadLeads();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" subtitle="Manage contacts, opportunity health, and follow-ups" action={<Button icon={<FiPlus />} onClick={() => setShowModal(true)}>Add Lead</Button>} />

      <LeadTable
        leads={paginatedLeads}
        filteredLeads={filteredLeads}
        loading={loading}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        page={page}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        refreshLeads={loadLeads}
        onDelete={handleDelete}
        onEdit={(lead) => console.log("edit", lead)}
        onMessage={(lead) => console.log("message", lead)}
        onSchedule={(lead) => console.log("schedule", lead)}
      />

      <LeadModal open={showModal} onClose={() => setShowModal(false)} onSuccess={loadLeads} />
    </div>
  );
}
