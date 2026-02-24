import { useEffect, useState } from "react";
import API from "../../services/api";
import CaseCard from "../../components/CaseCard";

const CaseList = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    API.get("/cases").then(res => setCases(res.data));
  }, []);

  return (
    <div>
      <h2>Cases</h2>
      {cases.map(c => <CaseCard key={c.id} caseData={c} />)}
    </div>
  );
};

export default CaseList;
