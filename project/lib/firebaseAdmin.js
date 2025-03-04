const admin = require("firebase-admin");

// Check if the app has already been initialized
if (!admin.apps.length) {
  const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
