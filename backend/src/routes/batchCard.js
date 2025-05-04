const express = require('express');
const { getBatchCard, addSignature } = require('../controllers/batchCardController');
const { validateSignature } = require('../middleware/validate');
const router = express.Router();

router.get('/', getBatchCard);
router.post('/sign', validateSignature, addSignature);

module.exports = router;