import { Router } from "express";
import { requireAuth } from "../lib/auth.js";

const router = Router();

const MOCK_CRIMINALS = [
  { id: 1, name: "Rajesh Kumar", age: 35, gender: "Male", nationality: "Indian", criminalRecord: "Armed robbery (2019), Assault (2021)", lastKnownLocation: "Delhi NCR", confidence: 94.7, status: "wanted" as const, photoUrl: "" },
  { id: 2, name: "Priya Sharma", age: 28, gender: "Female", nationality: "Indian", criminalRecord: "Fraud (2020), Money Laundering (2022)", lastKnownLocation: "Mumbai", confidence: 87.2, status: "wanted" as const, photoUrl: "" },
  { id: 3, name: "Mohammed Ali", age: 42, gender: "Male", nationality: "Indian", criminalRecord: "Drug trafficking (2018, 2021)", lastKnownLocation: "Hyderabad", confidence: 91.5, status: "wanted" as const, photoUrl: "" },
  { id: 4, name: "Sunita Devi", age: 31, gender: "Female", nationality: "Indian", criminalRecord: "None - Missing person", lastKnownLocation: "Last seen Kolkata", confidence: 78.9, status: "missing" as const, photoUrl: "" },
  { id: 5, name: "Vikram Singh", age: 38, gender: "Male", nationality: "Indian", criminalRecord: "Cleared all charges", lastKnownLocation: "Bangalore", confidence: 65.3, status: "cleared" as const, photoUrl: "" },
];

router.post("/match", requireAuth, async (req, res) => {
  try {
    const { imageBase64, searchType = "all" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Bad Request", message: "imageBase64 required" });
    }
    await new Promise(r => setTimeout(r, 1200));
    let matches = MOCK_CRIMINALS;
    if (searchType === "criminal") {
      matches = matches.filter(m => m.status === "wanted");
    } else if (searchType === "missing_person") {
      matches = matches.filter(m => m.status === "missing");
    }
    const shuffled = matches.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
    const withVariedConfidence = shuffled.map(m => ({
      ...m,
      confidence: Math.max(60, Math.min(99, m.confidence + (Math.random() - 0.5) * 10)),
    })).sort((a, b) => b.confidence - a.confidence);
    return res.json({
      matches: withVariedConfidence,
      totalMatches: withVariedConfidence.length,
      processingTime: 1.2 + Math.random() * 0.5,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
