const axios = require('axios');
const db = require('../config/db');

exports.getBatchCard = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.PYTHON_API_URL}/generate-batch-wish`);
    const batchWish = response.data.batch_wish;

    db.all('SELECT name, emoji, message FROM signatures ORDER BY created_at DESC', [], (err, signatures) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ batch_wish: batchWish, signatures });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch batch card' });
  }
};

exports.addSignature = (req, res) => {
  const { name, emoji, message } = req.body;
  db.run(
    'INSERT INTO signatures (name, emoji, message, created_at) VALUES (?, ?, ?, ?)',
    [name, emoji, message, new Date().toISOString()],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Signature added' });
    }
  );
};