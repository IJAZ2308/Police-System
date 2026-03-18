import { Router } from "express";
import { db, casesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  try {
    const cases = await db.select().from(casesTable).orderBy(desc(casesTable.createdAt));
    return res.json({ cases, total: cases.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const [c] = await db.select().from(casesTable).where(eq(casesTable.id, Number(req.params.id)));
    if (!c) return res.status(404).json({ error: "Not Found" });
    return res.json(c);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
