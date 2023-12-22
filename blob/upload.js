const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const imageController = require('./imageController');

const app = express();
const port = process.env.PORT || 7000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const storageClient = new Storage();
const bucketName = 'eyes-cat';

app.post('/upload', upload.single('blob'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const blobData = req.file.buffer;

    // Deteksi katarak
    const detectionResult = await imageController.detectCataract(blobData);

    // Tanggapan kepada klien
    res.status(200).json({ message: 'File uploaded and cataract detection complete', detectionResult });
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Awesome! Server is running on port ${port}`);
});

module.exports = app;
