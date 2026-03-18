import { Router } from "express";
import { db, usersTable, reportsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

const OFFICER_LOCATIONS: Record<number, { lat: number; lng: number }> = {
  1: { lat: 28.6139, lng: 77.2090 },
  2: { lat: 28.6229, lng: 77.2250 },
  3: { lat: 28.6050, lng: 77.1980 },
  4: { lat: 28.6350, lng: 77.2150 },
  5: { lat: 28.6010, lng: 77.2300 },
};

router.get("/", requireAuth, async (_req, res) => {
  try {
    const officers = await db.select().from(usersTable).where(eq(usersTable.role, "officer"));
    const result = officers.map((o, i) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      badgeNumber: o.badgeNumber || `BADGE-${String(o.id).padStart(4, "0")}`,
      rank: o.rank || "Sub-Inspector",
      department: o.department || "General Duty",
      status: i % 3 === 0 ? "off_duty" : "on_duty",
      activeCases: Math.floor(Math.random() * 8),
      latitude: OFFICER_LOCATIONS[i + 1]?.lat || 28.6139 + (Math.random() - 0.5) * 0.05,
      longitude: OFFICER_LOCATIONS[i + 1]?.lng || 77.2090 + (Math.random() - 0.5) * 0.05,
      joinedDate: o.createdAt.toISOString(),
    }));
    const onDuty = result.filter(o => o.status === "on_duty").length;
    return res.json({ officers: result, total: result.length, onDuty });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/activity", requireAuth, async (_req, res) => {
  try {
    const officers = await db.select().from(usersTable).where(eq(usersTable.role, "officer"));
    const topOfficers = officers.slice(0, 5).map((o, i) => ({
      officerId: o.id,
      officerName: o.name,
      casesResolved: Math.floor(Math.random() * 20) + 5,
      casesAssigned: Math.floor(Math.random() * 25) + 8,
      responseTime: Math.round((Math.random() * 15 + 5) * 10) / 10,
    }));
    if (topOfficers.length === 0) {
      return res.json({ topOfficers: [
        { officerId: 1, officerName: "Amit Kumar", casesResolved: 18, casesAssigned: 22, responseTime: 7.5 },
        { officerId: 2, officerName: "Priya Singh", casesResolved: 15, casesAssigned: 19, responseTime: 8.2 },
        { officerId: 3, officerName: "Rahul Sharma", casesResolved: 12, casesAssigned: 17, responseTime: 9.1 },
      ]});
    }
    return res.json({ topOfficers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/patrol/routes", requireAuth, async (_req, res) => {
  const routes = [
    {
      id: 1, officerId: 1, officerName: "Amit Kumar Singh",
      startPoint: { lat: 28.6139, lng: 77.2090 },
      waypoints: [
        { lat: 28.6180, lng: 77.2150, priority: "high" },
        { lat: 28.6230, lng: 77.2200, priority: "critical" },
        { lat: 28.6270, lng: 77.2120, priority: "medium" },
        { lat: 28.6300, lng: 77.2050, priority: "high" },
      ],
      estimatedDuration: 90,
      coverageArea: "Central Delhi",
      riskZones: ["Market Area", "Bus Terminal"],
    },
    {
      id: 2, officerId: 2, officerName: "Priya Devi",
      startPoint: { lat: 28.6050, lng: 77.1980 },
      waypoints: [
        { lat: 28.6080, lng: 77.2030, priority: "medium" },
        { lat: 28.6010, lng: 77.2100, priority: "low" },
        { lat: 28.5980, lng: 77.2050, priority: "medium" },
      ],
      estimatedDuration: 60,
      coverageArea: "South Delhi",
      riskZones: ["Railway Station"],
    },
    {
      id: 3, officerId: 3, officerName: "Rahul Sharma",
      startPoint: { lat: 28.6350, lng: 77.2150 },
      waypoints: [
        { lat: 28.6380, lng: 77.2200, priority: "critical" },
        { lat: 28.6420, lng: 77.2240, priority: "high" },
        { lat: 28.6400, lng: 77.2180, priority: "medium" },
      ],
      estimatedDuration: 75,
      coverageArea: "North Delhi",
      riskZones: ["Industrial Area", "Night Market"],
    },
  ];
  return res.json({ routes, totalOfficers: 3 });
});

export default router;
