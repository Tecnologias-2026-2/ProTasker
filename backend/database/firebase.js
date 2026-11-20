import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let firebaseApp;

export function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Configura FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY."
    );
  }

  firebaseApp = getApps().find((app) => app.name === "protasker-api") ||
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId
    }, "protasker-api");
  return firebaseApp;
}

export function getFirebaseAuth() {
  return getAuth(firebaseApp || initializeFirebase());
}

export function getFirestoreDb() {
  return getFirestore(firebaseApp || initializeFirebase());
}
