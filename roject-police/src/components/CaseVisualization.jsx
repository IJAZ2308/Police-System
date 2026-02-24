import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { supabase } from "../services/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function CaseVisualization() {
  const [crimeTypes, setCrimeTypes] = useState({});
  const [locations, setLocations] = useState({});

  useEffect(() => {
    fetchCrimeData();
  }, []);

  const fetchCrimeData = async () => {
    const { data, error } = await supabase
      .from("crimes")
      .select("type, location");

    if (!error && data) {
      const typeCount = {};
      const locationCount = {};

      data.forEach(crime => {
        typeCount[crime.type] = (typeCount[crime.type] || 0) + 1;
        locationCount[crime.location] = (locationCount[crime.location] || 0) + 1;
      });

      setCrimeTypes(typeCount);
      setLocations(locationCount);
    }
  };

  return (
    <DashboardLayout>
      <div
        className="card"
        style={{
          padding: "20px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Case Analysis</h2>

        {/* Bar Chart */}
        <div style={{ width: "60%", margin: "20px auto" }}>
          <h4>Cases by Crime Type</h4>
          <Bar
            data={{
              labels: Object.keys(crimeTypes),
              datasets: [
                {
                  label: "Number of Cases",
                  data: Object.values(crimeTypes),
                  backgroundColor: "rgba(255, 99, 132, 0.6)"
                }
              ]
            }}
          />
        </div>

        {/* Pie Chart */}
        <div style={{ width: "50%", margin: "40px auto" }}>
          <h4>Cases by Location</h4>
          <Pie
            data={{
              labels: Object.keys(locations),
              datasets: [
                {
                  data: Object.values(locations),
                  backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffce56",
                    "#4bc0c0"
                  ]
                }
              ]
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CaseVisualization;