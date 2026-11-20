import { getFirestoreDb } from "../database/firebase.js";

function tasksCollection(uid) {
  return getFirestoreDb().collection("users").doc(uid).collection("tasks");
}

export async function listTasks(uid) {
  const snapshot = await tasksCollection(uid).get();
  return snapshot.docs.map((document) => ({ ...document.data(), id: document.id }));
}

export async function saveTask(uid, task) {
  await tasksCollection(uid).doc(task.id).set(task);
  return task;
}

export async function deleteTask(uid, taskId) {
  await tasksCollection(uid).doc(taskId).delete();
}
