const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
