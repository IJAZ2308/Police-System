import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth, type AuthRequest } from "../lib/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Bad Request", message: "Email and password required" });
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        badgeNumber: user.badgeNumber,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", message: "Login failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role = "citizen", phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Bad Request", message: "Email, password and name required" });
    }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      return res.status(400).json({ error: "Bad Request", message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      email, passwordHash, name,
      role: role as "admin" | "officer" | "citizen",
      phone: phone || null,
    }).returning();
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        badgeNumber: user.badgeNumber,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", message: "Registration failed" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
    if (!user) return res.status(404).json({ error: "Not Found" });
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      badgeNumber: user.badgeNumber,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
