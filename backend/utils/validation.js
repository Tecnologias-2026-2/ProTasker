const priorities = new Set(["low", "medium", "high"]);
const taskIdPattern = /^[A-Za-z0-9_-]{1,128}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidDate(value) {
  if (typeof value !== "string" || !datePattern.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isValidTaskId(taskId) {
  return typeof taskId === "string" && taskIdPattern.test(taskId);
}

export function normalizeTask(taskId, body) {
  if (!isValidTaskId(taskId) || !isRecord(body)) {
    return null;
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description : null;
  const completedAt = body.completedAt ?? null;
  const completedAtIsValid = completedAt === null ||
    (typeof completedAt === "string" && !Number.isNaN(Date.parse(completedAt)));

  if (
    title.length < 1 ||
    title.length > 160 ||
    description === null ||
    description.length > 2000 ||
    !isValidDate(body.date) ||
    typeof body.time !== "string" ||
    !timePattern.test(body.time) ||
    !priorities.has(body.priority) ||
    typeof body.completed !== "boolean" ||
    !completedAtIsValid
  ) {
    return null;
  }

  return {
    id: taskId,
    title,
    description,
    date: body.date,
    time: body.time,
    priority: body.priority,
    completed: body.completed,
    completedAt
  };
}

export function isValidCalendarEvent(taskId, body) {
  return isValidTaskId(taskId) &&
    isRecord(body) &&
    typeof body.eventId === "string" &&
    body.eventId.length > 0 &&
    body.eventId.length <= 1024 &&
    !/[\u0000-\u001f]/.test(body.eventId);
}

export function isValidCalendarEmail(body) {
  return isRecord(body) &&
    typeof body.email === "string" &&
    body.email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email);
}
