import { useEffect, useState } from "react";

import { getAnalytics } from "../services/analytics";

import { getLeads } from "../services/leads";

export default function useDashboard() {
  const [stats, setStats] = useState({});

  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [analyticsData, leadsData] = await Promise.all([
        getAnalytics(),

        getLeads(),
      ]);

      setStats(analyticsData || {});

      setLeads(leadsData || []);
    } catch (error) {
      console.error("Dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    stats,

    leads,

    loading,

    refresh: loadDashboard,
  };
}
