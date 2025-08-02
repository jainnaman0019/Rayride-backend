const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // path to your downloaded credentials

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "your=+-database url"
});

const db = admin.firestore();

module.exports = db;
