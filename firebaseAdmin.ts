import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://izytask-79225.appspot.com',
});

const bucket = admin.storage().bucket();

export { bucket };