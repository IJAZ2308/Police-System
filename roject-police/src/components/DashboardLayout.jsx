import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>🚔 Police AI</h2>
        <a href="/alerts">Alerts</a>

        <a href="/dashboard">Dashboard</a>
        <a href="/cases">Cases</a>
        <a href="/heatmap">Heatmap</a>
        <a href="/reports">Reports</a>
      </div>

      <div className="main">
        <Navbar />
        <div className="content">{children}</div>
      </div>
      
    </div>
  );
};

export default DashboardLayout;