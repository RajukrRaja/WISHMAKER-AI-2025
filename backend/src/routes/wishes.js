const express = require('express');
const { generateWish } = require('../controllers/wishController');
const { validateWish } = require('../middleware/validate');
const router = express.Router();

router.post('/', validateWish, generateWish);

module.exports = router;