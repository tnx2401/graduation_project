const admin = require("firebase-admin");

// Check if the app has already been initialized
if (!admin.apps.length) {
  const serviceAccount = require("./realestate-project-28361-firebase-adminsdk-vrtw3-55eb9559d6.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
