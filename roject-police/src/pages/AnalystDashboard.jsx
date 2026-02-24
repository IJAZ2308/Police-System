import Navbar from "../components/Navbar";
import Heatmap from "../components/Heatmap";
import CaseVisualization from "../components/CaseVisualization";

function AnalystDashboard() {
  return (
    <>
      <Navbar />
      <h2>Crime Analyst Dashboard</h2>
      <CaseVisualization />
      <Heatmap />
    </>
  );
}

export default AnalystDashboard;
