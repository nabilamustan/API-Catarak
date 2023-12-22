const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Registrasi
app.post('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Validasi input
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'Oops! All fields are required.' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullname,
    });

    res.status(200).json({ message: 'Hooray! User registered successfully.', uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: 'Oh no! ' + error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: 'Uh-oh! Email and password are required.' });
    }

    const userRecord = await admin.auth().getUserByEmail(email);

    res.status(200).json({ message: 'Great! Login successful.', uid: userRecord.uid, fullname: userRecord.displayName });
  } catch (error) {
    res.status(500).json({ error: 'Oops! ' + error.message });
  }
});

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`Awesome! Server is running on port ${PORT}`);
});

module.exports = app;
