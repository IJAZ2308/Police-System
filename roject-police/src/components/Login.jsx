import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Make sure this file exists

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload
    // Dummy role logic (replace with backend later)
    if (username.toLowerCase() === "admin") {
      localStorage.setItem("role", "ADMIN");
      navigate("/admin");
    } else if (username.toLowerCase() === "police") {
      localStorage.setItem("role", "POLICE");
      navigate("/police");
    } else {
      localStorage.setItem("role", "ANALYST");
      navigate("/analyst");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="neon-text">AI Police Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          New user? <a href="/signup">Signup here</a>
        </p>
      </div>
      <div className="particles"></div>
    </div>
  );
}

export default Login;
