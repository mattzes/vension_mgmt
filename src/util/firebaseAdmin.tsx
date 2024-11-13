import admin from 'firebase-admin';
import serviceAccount from '@/dev-vension-mgmt-ca107511fd7d.json';

const appName = 'firebaseAdmin';

// Check if the Firebase Admin app with the specified name is already initialized
export const firebaseAdmin = admin.apps.length
  ? admin.app(appName) // Use the existing app if it's already initialized
  : admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      },
      appName
    );
