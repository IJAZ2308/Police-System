import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";

function CrimeTable() {
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrimes();
  }, []);

  const fetchCrimes = async () => {
    const { data, error } = await supabase
      .from("crimes")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching crimes:", error);
    } else {
      setCrimes(data);
    }
    setLoading(false);
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
        <h2>Crime Records</h2>

        {loading ? (
          <p>Loading crime data...</p>
        ) : (
          <table border="1" width="100%" style={{ marginTop: "15px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Crime Type</th>
                <th>Location</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {crimes.length > 0 ? (
                crimes.map((crime) => (
                  <><td>
                    <span className={`badge ${crime.status === "closed" ? "badge-closed" : "badge-open"}`}>
                      {crime.status}
                    </span>
                  </td><tr key={crime.id}>
                      <td>{crime.id}</td>
                      <td>{crime.type}</td>
                      <td>{crime.location}</td>
                      <td>{crime.date}</td>
                    </tr></>
                ))
              ) : (
                <tr>
                  <td colSpan="4" align="center">
                    No crime records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CrimeTable;