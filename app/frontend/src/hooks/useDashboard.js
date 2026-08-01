import { useEffect, useState } from "react";

import { getActivities, getAnalytics } from "../services/analytics";

import { getLeads } from "../services/leads";

export default function useDashboard() {
  const [stats, setStats] = useState({});

  const [leads, setLeads] = useState([]);

  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [analyticsData, leadsData, activitiesData] = await Promise.all([
        getAnalytics(),
        getLeads(),
        getActivities(),
      ]);

      setStats(analyticsData || {});
      setLeads(leadsData || []);
      setActivities(activitiesData || []);
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
    activities,
    loading,
    refresh: loadDashboard,
  };
}
