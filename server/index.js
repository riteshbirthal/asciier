const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const videoRoutes = require('./routes/video');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, '../uploads');
const outputsDir = path.join(__dirname, '../outputs');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

app.use('/api/video', videoRoutes);

app.use('/uploads', express.static(uploadsDir));
app.use('/outputs', express.static(outputsDir));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ASCIIer API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  console.log(`Outputs directory: ${outputsDir}`);
});
