import { getFirestoreDb } from "../database/firebase.js";

function calendarEventsCollection(uid) {
  return getFirestoreDb().collection("users").doc(uid).collection("calendarEvents");
}

function calendarAccountDocument(uid) {
  return getFirestoreDb()
    .collection("users")
    .doc(uid)
    .collection("calendarSettings")
    .doc("googleCalendar");
}

export async function listCalendarEvents(uid) {
  const snapshot = await calendarEventsCollection(uid).get();
  return snapshot.docs.map((document) => ({
    taskId: document.id,
    ...document.data()
  }));
}

export async function saveCalendarEvent(uid, taskId, eventId) {
  await calendarEventsCollection(uid).doc(taskId).set({ eventId });
}

export async function deleteCalendarEvent(uid, taskId) {
  await calendarEventsCollection(uid).doc(taskId).delete();
}

export async function getCalendarAccount(uid) {
  const document = await calendarAccountDocument(uid).get();
  return document.exists ? document.data().email : null;
}

export async function saveCalendarAccount(uid, email) {
  await calendarAccountDocument(uid).set({ email });
}
