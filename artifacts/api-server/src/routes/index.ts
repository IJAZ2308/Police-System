import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import crimeRouter from "./crime.js";
import alertsRouter from "./alerts.js";
import firRouter from "./fir.js";
import faceRouter from "./face.js";
import officersRouter from "./officers.js";
import casesRouter from "./cases.js";
import chatbotRouter from "./chatbot.js";
import dashboardRouter from "./dashboard.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);

router.use(crimeRouter);

router.use("/alerts", alertsRouter);
router.use("/fir", firRouter);
router.use("/face", faceRouter);
router.use("/officers", officersRouter);
router.use("/patrol", officersRouter);
router.use("/cases", casesRouter);
router.use("/chatbot", chatbotRouter);
router.use("/dashboard", dashboardRouter);

export default router;
