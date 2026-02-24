import Navbar from "../components/Navbar";
import CrimeTable from "../components/CrimeTable";

function PoliceDashboard() {
  return (
    <>
      <Navbar />
      <h2>Police Dashboard</h2>
      <h3>Registered Crime Cases</h3>
      <CrimeTable />
    </>
  );
}

export default PoliceDashboard;
