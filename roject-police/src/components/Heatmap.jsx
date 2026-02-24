import React, { useEffect, useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { supabase } from "../services/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";
import "mapbox-gl/dist/mapbox-gl.css";

function Heatmap() {
  const [geoData, setGeoData] = useState(null);
  const [selectedCrime, setSelectedCrime] = useState(null);

  useEffect(() => {
    fetchCrimeData();
  }, []);

  const fetchCrimeData = async () => {
    const { data, error } = await supabase
      .from("crimes")
      .select("id,type,location,latitude,longitude,date");

    if (error) {
      console.error("Supabase fetch error:", error);
      return;
    }

    if (data && data.length > 0) {
      setGeoData({
        type: "FeatureCollection",
        features: data.map(c => ({
          type: "Feature",
          properties: {
            id: c.id,
            type: c.type,
            location: c.location,
            date: c.date
          },
          geometry: {
            type: "Point",
            coordinates: [c.longitude, c.latitude]
          }
        }))
      });
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
        <h2>Crime Heatmap</h2>

        <div
          className="map-container"
          style={{ height: "600px", marginTop: "15px" }}
        >
          <Map
            initialViewState={{
              latitude: 20.5937,
              longitude: 78.9629,
              zoom: 4
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            onClick={e => {
              const feature = e.features?.[0];
              if (feature && !feature.properties.cluster) {
                setSelectedCrime(feature);
              }
            }}
            interactiveLayerIds={["crime-points"]}
            style={{ width: "100%", height: "100%" }}
          >
            {geoData && (
              <Source
                id="crimes"
                type="geojson"
                data={geoData}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
              >
                {/* Clusters */}
                <Layer
                  id="clusters"
                  type="circle"
                  filter={["has", "point_count"]}
                  paint={{
                    "circle-color": "#f28cb1",
                    "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40]
                  }}
                />

                {/* Cluster Count */}
                <Layer
                  id="cluster-count"
                  type="symbol"
                  filter={["has", "point_count"]}
                  layout={{
                    "text-field": "{point_count_abbreviated}",
                    "text-size": 12
                  }}
                />

                {/* Individual Points */}
                <Layer
                  id="crime-points"
                  type="circle"
                  filter={["!", ["has", "point_count"]]}
                  paint={{
                    "circle-color": "#ff0000",
                    "circle-radius": 8
                  }}
                />
              </Source>
            )}

            {/* Popup */}
            {selectedCrime && (
              <Popup
                longitude={selectedCrime.geometry.coordinates[0]}
                latitude={selectedCrime.geometry.coordinates[1]}
                closeOnClick={true}
                onClose={() => setSelectedCrime(null)}
              >
                <div>
                  <b>Crime Type:</b> {selectedCrime.properties.type} <br />
                  <b>Location:</b> {selectedCrime.properties.location} <br />
                  <b>Date:</b> {selectedCrime.properties.date}
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Heatmap;