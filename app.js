const express = require('express');
const app = express();

const userAuthAPI = require('./UserAuth/api');
const uploadAPI = require('./blob/upload');
const imageController = require('./controller/imageController');

app.use('/user', userAuthAPI);
app.use('/upload', uploadAPI);

// Endpoint untuk deteksi katarak
app.post('/detectCataract', async (req, res) => {
  const imageUrl = req.body.imageUrl;

  try {
    const result = await imageController.detectCataract(imageUrl);
    res.status(200).json({ message: 'Cataract detection successful', result });
  } catch (error) {
    res.status(500).json({ error: 'Error in cataract detection: ' + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Awesome! Server is running on port ${PORT}`);
});

module.exports = app;
