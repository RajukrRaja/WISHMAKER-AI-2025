const axios = require('axios');
const db = require('../config/db');

exports.generateWish = async (req, res) => {
  try {
    const { name, theme, vibe } = req.body;
    const response = await axios.post(`${process.env.PYTHON_API_URL}/generate-wish`, { name, theme, vibe });
    const wish = response.data.wish;

    db.run(
      'INSERT INTO wishes (name, theme, vibe, wish, created_at) VALUES (?, ?, ?, ?, ?)',
      [name, theme, vibe, wish, new Date().toISOString()],
      (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ wish });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate wish' });
  }
};