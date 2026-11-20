import * as calendarModel from "../models/calendarModel.js";
import {
  isValidCalendarEmail,
  isValidCalendarEvent,
  isValidTaskId
} from "../utils/validation.js";

export async function getEvents(request, response, next) {
  try {
    response.json(await calendarModel.listCalendarEvents(request.user.uid));
  } catch (error) {
    next(error);
  }
}

export async function putEvent(request, response, next) {
  const { taskId } = request.params;
  if (!isValidCalendarEvent(taskId, request.body)) {
    response.status(400).json({
      error: { code: "calendar/invalid-event", message: "Los datos del evento no son válidos." }
    });
    return;
  }

  try {
    await calendarModel.saveCalendarEvent(request.user.uid, taskId, request.body.eventId);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function removeEvent(request, response, next) {
  if (!isValidTaskId(request.params.taskId)) {
    response.status(400).json({
      error: { code: "calendar/invalid-task-id", message: "El identificador de la tarea no es válido." }
    });
    return;
  }

  try {
    await calendarModel.deleteCalendarEvent(request.user.uid, request.params.taskId);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function getCalendarAccount(request, response, next) {
  try {
    response.json({ email: await calendarModel.getCalendarAccount(request.user.uid) });
  } catch (error) {
    next(error);
  }
}

export async function putCalendarAccount(request, response, next) {
  if (!isValidCalendarEmail(request.body)) {
    response.status(400).json({
      error: { code: "calendar/invalid-email", message: "El correo de Google Calendar no es válido." }
    });
    return;
  }

  try {
    await calendarModel.saveCalendarAccount(request.user.uid, request.body.email.trim());
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}
