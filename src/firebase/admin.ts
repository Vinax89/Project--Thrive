import "server-only";
import { initializeApp, getApps, getApp, type App } from "firebase-admin/app";
import { firebaseConfig } from "./config"; // Using the same client-side config for simplicity

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

function getAdminApp(): App {
  if (getApps().some(app => app.name === 'admin')) {
    return getApp('admin');
  }

  return initializeApp({
    credential: serviceAccount ? undefined : undefined, // In a real app, you'd use admin.credential.cert(serviceAccount)
    projectId: firebaseConfig.projectId,
  }, 'admin');
}

export const adminApp = getAdminApp();
