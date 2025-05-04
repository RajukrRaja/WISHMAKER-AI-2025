const axios = require('axios');

exports.generateCollage = async (req, res) => {
  try {
    const { images } = req.body;
    const response = await axios.post(`${process.env.PYTHON_API_URL}/generate-collage`, { images });
    res.json({ collage: response.data.collage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate collage' });
  }
};