import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';

const appName = 'firebaseAdmin';

// Check if the Firebase Admin app with the specified name is already initialized
export const firebaseAdmin = admin.apps.length
  ? admin.app(appName) // Use the existing app if it's already initialized
  : admin.initializeApp(
      {
        credential: cert({
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      },
      appName
    );

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
