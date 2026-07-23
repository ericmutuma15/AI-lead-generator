import { useEffect, useMemo, useState } from "react";
import { getLeads } from "../services/leads";

export default function useLeads() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [source, setSource] = useState("All");

  const [sort, setSort] = useState("Newest");

  const refresh = async () => {
    try {
      setLoading(true);

      const data = await getLeads();

      setLeads(data);

      setError("");
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredLeads = useMemo(() => {
    let data = [...leads];

    /* ---------- Search ---------- */

    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter((lead) =>
        [
          lead.name,
          lead.phone,
          lead.interest,
          lead.source,
          lead.status,
        ]
          .filter(Boolean)
          .some((value) =>
            value.toLowerCase().includes(query)
          )
      );
    }

    /* ---------- Status ---------- */

    if (status !== "All") {
      data = data.filter(
        (lead) => lead.status === status
      );
    }

    /* ---------- Source ---------- */

    if (source !== "All") {
      data = data.filter(
        (lead) => lead.source === source
      );
    }

    /* ---------- Sorting ---------- */

    switch (sort) {
      case "Newest":
        data.sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        );
        break;

      case "Oldest":
        data.sort(
          (a, b) =>
            new Date(a.created_at) -
            new Date(b.created_at)
        );
        break;

      case "Name A-Z":
        data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "Name Z-A":
        data.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      default:
        break;
    }

    return data;
  }, [
    leads,
    search,
    status,
    source,
    sort,
  ]);

  return {
    loading,
    error,

    leads,

    filteredLeads,

    refresh,

    search,
    setSearch,

    status,
    setStatus,

    source,
    setSource,

    sort,
    setSort,
  };
}