const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

const app = express();
const port = process.env.PORT || 4000;

// Konfigurasi Multer untuk menyimpan file di folder 'uploads'
const uploadDirectory = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Inisialisasi penyimpanan Cloud Storage
const storageClient = new Storage();
const bucketName = 'eyes-cat';

app.post('/upload', upload.single('blob'), async (req, res) => {
  const blobData = req.file.buffer;

  const modelFileName = 'model.json';
  const modelFile = storageClient.bucket(bucketName).file(modelFileName);

  await modelFile.save(blobData, { contentType: 'application/json' });

  const modelUrl = `https://storage.googleapis.com/eyes-cat/model.json`;

  res.status(200).json({ message: 'File uploaded successfully', modelUrl });
});

app.listen(port, () => {
  console.log(`Awesome! Server is running on port ${port}`);
});

module.exports = app;
