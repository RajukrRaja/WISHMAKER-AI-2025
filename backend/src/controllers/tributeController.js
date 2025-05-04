const axios = require('axios');
const db = require('../config/db');

exports.generateTribute = async (req, res) => {
  try {
    const { friend_name, memory } = req.body;
    const response = await axios.post(`${process.env.PYTHON_API_URL}/generate-tribute`, { friend_name, memory });
    const tribute = response.data.tribute;

    db.run(
      'INSERT INTO tributes (friend_name, memory, tribute, created_at) VALUES (?, ?, ?, ?)',
      [friend_name, memory, tribute, new Date().toISOString()],
      (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ tribute });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate tribute' });
  }
};