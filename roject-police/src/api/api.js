const API_BASE = "http://127.0.0.1:8000";

// Helper function for requests
const request = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Attach token automatically if exists
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  // Attach body if provided
  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, options);

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.detail || "Something went wrong");
  }

  return result;
};



// ==============================
// AUTH
// ==============================

export const registerUser = async (data) => {
  return request("/citizen/register", "POST", data);
};



// ==============================
// FIR
// ==============================

export const createFIR = async (data) => {
  return request("/fir/create", "POST", data);
};
