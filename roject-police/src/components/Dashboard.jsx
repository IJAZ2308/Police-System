import DashboardLayout from "./DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid">
        <div className="card stat">
          <h3>Total Cases</h3>
          <p>1,245</p>
        </div>

        <div className="card stat">
          <h3>Active Cases</h3>
          <p>320</p>
        </div>

        <div className="card stat">
          <h3>Resolved</h3>
          <p>925</p>
        </div>

        <div className="card stat danger">
          <h3>High Risk Zones</h3>
          <p>12</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;