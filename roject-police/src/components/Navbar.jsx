import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      className="topbar"
      style={{
        background: "#222",
        padding: "10px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left Side */}
      <h3 style={{ margin: 0 }}>AI Police System - Dashboard</h3>

      {/* Right Side */}
      <div className="top-right" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <span>👮 Admin</span>
        <button
          onClick={logout}
          className="btn btn-danger"
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;