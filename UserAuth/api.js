const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Registrasi
app.post('/register', (req, res) => {
  const { fullname, email, password } = req.body;

  // Validasi input
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'Oops! All fields are required.' });
  }

  admin.auth().createUser({
    email,
    password,
    displayName: fullname,
  })
  .then(userRecord => {
    
    res.status(200).json({ message: 'Hooray! User registered successfully.', uid: userRecord.uid });
  })
  .catch(error => {
    res.status(500).json({ error: 'Oh no! ' + error.message });
  });
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