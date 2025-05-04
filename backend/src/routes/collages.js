const express = require('express');
const { generateCollage } = require('../controllers/collageController');
const router = express.Router();

router.post('/', generateCollage);

module.exports = router;