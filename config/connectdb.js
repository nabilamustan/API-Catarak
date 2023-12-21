const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDb = require('./connectdb');

const app = express();

app.use(bodyParser.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Registrasi
app.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;

  // Validasi input
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'Oops! All fields are required.' });
  }

  try {
    // Buat pengguna di Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullname,
    });

    // Simpan data pengguna di Firestore
    await connectDb.saveUserData(userRecord.uid, fullname, email);

    res.status(200).json({ message: 'Hooray! User registered successfully.', uid: userRecord.uid });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Oh no! ' + error.message });
  }
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ error: 'Uh-oh! Email and password are required.' });
  }

  admin.auth().getUserByEmail(email)
    .then(userRecord => {
      res.status(200).json({ message: 'Great! Login successful.', uid: userRecord.uid, fullname: userRecord.displayName });
    })
    .catch(error => {
      res.status(500).json({ error: 'Oops! ' + error.message });
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Awesome! Server is running on port ${PORT}`);
});

module.exports = app;
