import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();

    // 🔥 realtime updates
    const channel = supabase
      .channel("alerts-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        payload => {
          setAlerts(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setAlerts(data);
    }
  };

  return (
    <div className="card">
      <h3>🚨 Alerts</h3>

      {alerts.length > 0 ? (
        alerts.map(alert => (
          <p key={alert.id}>⚠️ {alert.message}</p>
        ))
      ) : (
        <p>No alerts</p>
      )}
    </div>
  );
}

export default AlertsPanel;