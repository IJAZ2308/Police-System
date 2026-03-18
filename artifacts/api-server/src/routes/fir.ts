import { Router } from "express";
import { db, firsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../lib/auth.js";

const router = Router();

const IPC_SECTIONS: Record<string, string[]> = {
  "Robbery": ["IPC 392", "IPC 394", "IPC 397"],
  "Theft": ["IPC 379", "IPC 380", "IPC 381"],
  "Assault": ["IPC 323", "IPC 324", "IPC 325"],
  "Murder": ["IPC 300", "IPC 302", "IPC 304"],
  "Fraud": ["IPC 420", "IPC 415", "IPC 417"],
  "Drug Trafficking": ["NDPS Act 20", "NDPS Act 22", "IPC 328"],
  "Kidnapping": ["IPC 359", "IPC 362", "IPC 363"],
  "Cybercrime": ["IT Act 66", "IT Act 66C", "IT Act 66D"],
  "Domestic Violence": ["PWDV Act 3", "IPC 498A", "IPC 323"],
  "Sexual Harassment": ["IPC 354", "IPC 354A", "IPC 509"],
  "Vandalism": ["IPC 425", "IPC 427"],
  "Extortion": ["IPC 383", "IPC 384", "IPC 385"],
  "Burglary": ["IPC 454", "IPC 457", "IPC 380"],
  "Vehicle Theft": ["IPC 379", "MVA 184"],
  "Gang Activity": ["IPC 141", "IPC 143", "IPC 506"],
};

function generateFirSummary(description: string, crimeType: string, complainantName: string, location: string): string {
  const sections = IPC_SECTIONS[crimeType] || ["IPC 379"];
  return `This is to inform that ${complainantName} appeared before the undersigned and stated that on the date of incident at ${location || "the mentioned location"}, an incident of ${crimeType.toLowerCase()} occurred. The complainant states: "${description.slice(0, 200)}${description.length > 200 ? "..." : ""}". The applicable sections of law are ${sections.join(", ")}. The matter is being investigated. A case has been registered and investigation has been initiated.`;
}

router.post("/generate", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { description, complainantName, complainantPhone, crimeType, location, dateOfIncident } = req.body;
    if (!description || !complainantName || !crimeType) {
      return res.status(400).json({ error: "Bad Request", message: "description, complainantName, crimeType required" });
    }
    const firNumber = `FIR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ipcSections = IPC_SECTIONS[crimeType] || ["IPC 379"];
    const summary = generateFirSummary(description, crimeType, complainantName, location || "unknown location");
    const [fir] = await db.insert(firsTable).values({
      firNumber,
      complainantName,
      complainantPhone: complainantPhone || null,
      crimeType,
      ipcSections,
      description,
      location: location || null,
      dateOfIncident: dateOfIncident || new Date().toISOString().split("T")[0],
      summary,
      status: "filed",
      createdById: req.user!.userId,
    }).returning();
    return res.json({ fir });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/list", requireAuth, async (_req, res) => {
  try {
    const firs = await db.select().from(firsTable).orderBy(desc(firsTable.createdAt));
    return res.json({ firs, total: firs.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const [fir] = await db.select().from(firsTable).where(eq(firsTable.id, Number(req.params.id)));
    if (!fir) return res.status(404).json({ error: "Not Found" });
    return res.json(fir);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
