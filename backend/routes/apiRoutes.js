import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import calendarRoutes from "./calendarRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = Router();

router.use(authenticate);
router.use("/tasks", taskRoutes);
router.use("/calendar-events", calendarRoutes);

export default router;
