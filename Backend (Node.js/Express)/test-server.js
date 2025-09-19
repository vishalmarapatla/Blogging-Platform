const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/api/blogs', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Backend server is running!'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
