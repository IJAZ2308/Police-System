import { Router } from "express";
import { db, alertsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../lib/auth.js";

const router = Router();

router.post("/send", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { type, latitude, longitude, address, message } = req.body;
    if (!type || latitude == null || longitude == null) {
      return res.status(400).json({ error: "Bad Request", message: "type, latitude, longitude required" });
    }
    let senderName = "Anonymous";
    try {
      const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, req.user!.userId));
      if (user) senderName = user.name;
    } catch {}
    const [alert] = await db.insert(alertsTable).values({
      type: type as "panic" | "weapon" | "suspicious" | "accident" | "fire",
      latitude: String(latitude),
      longitude: String(longitude),
      address: address || null,
      message: message || null,
      senderId: req.user!.userId,
      senderName,
    }).returning();
    return res.status(201).json({
      ...alert,
      latitude: Number(alert.latitude),
      longitude: Number(alert.longitude),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/list", requireAuth, async (_req, res) => {
  try {
    const alerts = await db.select().from(alertsTable).orderBy(desc(alertsTable.createdAt)).limit(100);
    const activeCount = alerts.filter(a => a.status === "active").length;
    return res.json({
      alerts: alerts.map(a => ({
        ...a,
        latitude: Number(a.latitude),
        longitude: Number(a.longitude),
      })),
      activeCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:id/resolve", requireAuth, async (req, res) => {
  try {
    const [updated] = await db.update(alertsTable)
      .set({ status: "resolved", resolvedAt: new Date() })
      .where(eq(alertsTable.id, Number(req.params.id)))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not Found" });
    return res.json({
      ...updated,
      latitude: Number(updated.latitude),
      longitude: Number(updated.longitude),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
