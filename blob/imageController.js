const tf = require('@tensorflow/tfjs');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

const storage = new Storage();
const bucketName = 'eyes-cat';
const modelPath = 'Catarak/model.json';

async function loadModel() {
  // ... (fungsi untuk memuat model)
}

async function preprocessImage(imageBuffer) {
  // ... (fungsi untuk memproses gambar sebelum deteksi)
}

async function detectCataract(imageBuffer) {
  // ... (fungsi untuk melakukan deteksi katarak)
}

module.exports = {
  detectCataract,
};
