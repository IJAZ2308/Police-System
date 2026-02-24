import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("POLICE");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Store role in profiles table
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: email,
        role: role
      }
    ]);

    alert("Signup successful! Please login.");
    navigate("/");
    setLoading(false);
  };

  return (
    <div>
      <h2>AI Police System – Signup</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <select onChange={e => setRole(e.target.value)}>
        <option value="POLICE">Police Officer</option>
        <option value="ANALYST">Crime Analyst</option>
        <option value="CITIZEN">Citizen</option>
      </select>

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating Account..." : "Signup"}
      </button>
    </div>
  );
}

export default Signup;
