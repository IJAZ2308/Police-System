import { useParams } from "react-router-dom";
import API from "../../services/api";

const UploadEvidence = () => {
  const { caseId } = useParams();

  const upload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await API.post(`/evidence/upload/${caseId}`, formData);
    alert("Uploaded");
  };

  return (
    <div>
      <h3>Upload Evidence</h3>
      <input type="file" onChange={upload} />
    </div>
  );
};

export default UploadEvidence;
