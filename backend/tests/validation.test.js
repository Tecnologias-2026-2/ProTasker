import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidCalendarEmail,
  isValidCalendarEvent,
  isValidTaskId,
  normalizeTask
} from "../utils/validation.js";

const validTask = {
  title: "Entregar proyecto",
  description: "",
  date: "2026-11-20",
  time: "14:30",
  priority: "high",
  completed: false,
  completedAt: null
};

test("normalizes valid task data and trusts the route id", () => {
  assert.deepEqual(normalizeTask("task-123", { ...validTask, id: "another-user-data" }), {
    id: "task-123",
    ...validTask
  });
});

test("rejects malformed, oversized, and invalid task fields", () => {
  assert.equal(normalizeTask("task/123", validTask), null);
  assert.equal(normalizeTask("task-123", { ...validTask, date: "2026-02-31" }), null);
  assert.equal(normalizeTask("task-123", { ...validTask, date: "2026-02-29" }), null);
  assert.notEqual(normalizeTask("task-123", { ...validTask, date: "2024-02-29" }), null);
  assert.equal(normalizeTask("task-123", { ...validTask, title: "  " }), null);
  assert.equal(normalizeTask("task-123", { ...validTask, description: "x".repeat(2001) }), null);
  assert.equal(normalizeTask("task-123", { ...validTask, priority: "urgent" }), null);
  assert.equal(normalizeTask("task-123", { ...validTask, completedAt: "invalid" }), null);
});

test("accepts only safe task ids for Firestore paths", () => {
  assert.equal(isValidTaskId("68ec5bd7-45d2-48f5-8e08-4ce7dba380e2"), true);
  assert.equal(isValidTaskId("../other-user"), false);
  assert.equal(isValidTaskId(""), false);
});

test("validates calendar links and email addresses", () => {
  assert.equal(isValidCalendarEvent("task-123", { eventId: "google-event_1" }), true);
  assert.equal(isValidCalendarEvent("task-123", { eventId: "bad\nvalue" }), false);
  assert.equal(isValidCalendarEmail({ email: "student@example.edu" }), true);
  assert.equal(isValidCalendarEmail({ email: "not-an-email" }), false);
});
