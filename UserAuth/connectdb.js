const { invariantError } = require('../exceptions/invariantError');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const outputDb = db.collection('users');

async function saveUserData(user_name, user_email, user_password, request, h) {
  try {
    // Validate if the user with the given username or email already exists
    if (!(await checkIfAlreadyExists({ user_name, user_email }, outputDb))) {
      const message = "Username or Email not exists";
      console.log(message);
      return invariantError({ request, h }, message);
    }

    // Check if user exists by username
    const usernameQuerySnapshot = await outputDb.where('user_name', '==', user_name).get();
    // Check if user exists by email
    const emailQuerySnapshot = await outputDb.where('user_email', '==', user_email).get();

    let userData;

    // If user exists by username, use that data
    if (usernameQuerySnapshot.size != 0) {
      userData = usernameQuerySnapshot.docs[0].data();
    }
    // If user exists by email, use that data
    else if (emailQuerySnapshot.size != 0) {
      userData = emailQuerySnapshot.docs[0].data();
    }

    console.log("User exists");

    // Validate user password
    if (userData.user_pass !== user_password) {
      const message = "Password doesn't match";
      console.log(message);
      return invariantError({ request, h }, message);
    }

    console.log("Login success!");

    // Respond with success message and user data
    return h.response({
      error: false,
      message: "Login Success!",
      userData,
    }).code(200);
  } catch (error) {
    // Handle other errors
    console.error("Error:", error.message);
    return h.response({
      error: true,
      message: "Internal Server Error",
    }).code(500);
  }
}

module.exports = { saveUserData };
