import { useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 13.0827,
  lng: 80.2707,
};

const FIRForm = () => {
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  // Reverse Geocoding
  const getAddress = async (lat, lng) => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${lat},${lng}`,
          key: "YOUR_GOOGLE_MAPS_API_KEY",
        },
      }
    );

    if (res.data.results.length > 0) {
      setAddress(res.data.results[0].formatted_address);
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMarker({ lat, lng });
    getAddress(lat, lng);
  };

  const submitFIR = async () => {
    if (!marker) {
      alert("Please select location on map");
      return;
    }

    await axios.post("http://127.0.0.1:8000/fir/create", {
      ...form,
      latitude: marker.lat,
      longitude: marker.lng,
      address: address,
    });

    alert("FIR Submitted Successfully 🚔");
  };

  return (
    <div className="police-card">
      <h2>🚔 Register FIR</h2>

      <input
        className="police-input"
        placeholder="Title"
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        className="police-input"
        placeholder="Description"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onClick={handleMapClick}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </LoadScript>

      {address && (
        <div className="address-box">
          <strong>Selected Address:</strong>
          <p>{address}</p>
        </div>
      )}

      <button className="police-btn" onClick={submitFIR}>
        Submit FIR
      </button>
    </div>
  );
};

export default FIRForm;