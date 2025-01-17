import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `gs://${process.env.STORAGE_BUCKET}`,
});

const bucket = admin.storage().bucket();

export { bucket };