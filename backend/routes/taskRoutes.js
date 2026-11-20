import { Router } from "express";
import { getTasks, putTask, removeTask } from "../controllers/taskController.js";

const router = Router();

router.get("/", getTasks);
router.put("/:taskId", putTask);
router.delete("/:taskId", removeTask);

export default router;
