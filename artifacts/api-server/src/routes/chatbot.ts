import { Router } from "express";
import { requireAuth } from "../lib/auth.js";

const router = Router();

const LEGAL_RESPONSES: Record<string, { reply: string; suggestions: string[]; relatedSections: string[] }> = {
  "fir": {
    reply: "To file an FIR (First Information Report): 1) Visit the nearest police station. 2) Narrate the incident clearly to the officer in charge. 3) Ensure the FIR is registered and you receive a copy. 4) Note the FIR number for future reference. You can also file online at your state's police portal. Under Section 154 CrPC, the police are legally bound to register your FIR.",
    suggestions: ["How to file FIR online?", "What information is needed for FIR?", "Can police refuse to file FIR?"],
    relatedSections: ["Section 154 CrPC", "Section 155 CrPC", "Section 156 CrPC"],
  },
  "rights": {
    reply: "Your fundamental rights during police interaction: 1) Right to know reason for arrest (Art. 22). 2) Right to inform family/lawyer. 3) Right to be presented before magistrate within 24 hours. 4) Right against self-incrimination (Art. 20). 5) Right to bail in bailable offences. 6) Right to legal representation. If rights are violated, file a complaint with the Magistrate or Human Rights Commission.",
    suggestions: ["Rights during arrest", "Can police detain without FIR?", "Right to legal aid"],
    relatedSections: ["Article 20", "Article 21", "Article 22", "Section 41 CrPC"],
  },
  "complaint": {
    reply: "If you want to file a complaint against a police officer: 1) Approach the Superintendent of Police (SP). 2) File complaint with the State Police Complaints Authority. 3) Approach the National Human Rights Commission (NHRC). 4) File a writ petition in the High Court. Document everything with dates, names, and evidence. Keep copies of all documents.",
    suggestions: ["How to report police misconduct?", "State complaints authority contact", "NHRC complaint process"],
    relatedSections: ["Section 154 CrPC", "Article 226", "NHRC Act 1993"],
  },
  "bail": {
    reply: "Bail process: 1) For bailable offences, bail is a right - approach the police station directly. 2) For non-bailable offences, apply to the Sessions Court or High Court. 3) Anticipatory bail under Section 438 CrPC can be sought before arrest. 4) Bail bond requires surety. The court considers flight risk, evidence tampering risk, and gravity of offence.",
    suggestions: ["Anticipatory bail", "Bail conditions", "Bail rejection grounds"],
    relatedSections: ["Section 436 CrPC", "Section 437 CrPC", "Section 438 CrPC", "Section 439 CrPC"],
  },
  "domestic": {
    reply: "Domestic violence help: 1) Call Women Helpline: 1091 or 181. 2) Contact the Protection Officer in your district. 3) File complaint under Protection of Women from Domestic Violence Act 2005. 4) Seek protection order from the Magistrate. 5) You can get residence orders, monetary relief, and custody orders. NGOs like iCall and Snehi provide free counseling.",
    suggestions: ["Emergency shelter homes", "Protection order process", "Child custody rights"],
    relatedSections: ["PWDV Act 2005", "IPC 498A", "IPC 323", "IPC 506"],
  },
};

function findBestResponse(message: string): typeof LEGAL_RESPONSES[string] {
  const lower = message.toLowerCase();
  if (lower.includes("fir") || lower.includes("first information") || lower.includes("report crime")) {
    return LEGAL_RESPONSES["fir"];
  } else if (lower.includes("right") || lower.includes("arrest") || lower.includes("detain")) {
    return LEGAL_RESPONSES["rights"];
  } else if (lower.includes("complaint") || lower.includes("misconduct") || lower.includes("corrupt")) {
    return LEGAL_RESPONSES["complaint"];
  } else if (lower.includes("bail") || lower.includes("release") || lower.includes("custody")) {
    return LEGAL_RESPONSES["bail"];
  } else if (lower.includes("domestic") || lower.includes("violence") || lower.includes("abuse") || lower.includes("wife") || lower.includes("husband")) {
    return LEGAL_RESPONSES["domestic"];
  }
  return {
    reply: `I'm the AI Legal Assistant for the Police Smart System. I can help you with: filing FIRs, understanding your legal rights, domestic violence cases, bail procedures, and filing complaints against misconduct. Please describe your legal question in more detail and I'll provide specific guidance based on Indian law.`,
    suggestions: ["How to file FIR?", "What are my rights during arrest?", "How to get bail?", "File domestic violence complaint"],
    relatedSections: ["CrPC", "IPC", "Constitution of India"],
  };
}

router.post("/message", requireAuth, async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Bad Request", message: "message required" });
    }
    await new Promise(r => setTimeout(r, 500));
    const response = findBestResponse(message);
    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
