const admin = require('firebase-admin');

const serviceAccount = require('../UserAuth/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-database-url.firebaseio.com',
});

const db = admin.firestore();

async function saveUserData(uid, fullname, username, email) {
  try {
    await db.collection('users').doc(uid).set({
      fullname,
      username,
      email,
     
    });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

module.exports = { db, saveUserData };
