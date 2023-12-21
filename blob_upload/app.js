const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Tentukan direktori untuk menyimpan file
const uploadDirectory = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Konfigurasi Multer untuk menyimpan file di folder 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware untuk mengizinkan CORS (harap disesuaikan sesuai kebutuhan)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Route untuk meng-handle upload file blob
app.post('/upload', upload.single('blob'), (req, res) => {
  // Dapatkan blob data dari 'req.file.buffer'
  const blobData = req.file.buffer;

  // Lakukan sesuatu dengan blobData (misalnya, simpan ke penyimpanan atau kirim ke model ML)

  // Kirim respons
  res.status(200).json({ message: 'File uploaded successfully' });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
