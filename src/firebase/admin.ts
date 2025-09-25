import "server-only";

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

// IMPORTANT: Do not expose this to the client-side.
// This is a server-only file.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let adminApp: App;
let firestore: Firestore;
let auth: Auth;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : undefined,
  });
} else {
  adminApp = getApps()[0];
}

firestore = getFirestore(adminApp);
auth = getAuth(adminApp);

export function getFirebaseAdmin() {
  return { adminApp, firestore, auth };
}
