import { Router } from "express";
import {
  getCalendarAccount,
  getEvents,
  putCalendarAccount,
  putEvent,
  removeEvent
} from "../controllers/calendarController.js";

const router = Router();

router.get("/", getEvents);
router.get("/account", getCalendarAccount);
router.put("/account", putCalendarAccount);
router.put("/:taskId", putEvent);
router.delete("/:taskId", removeEvent);

export default router;
