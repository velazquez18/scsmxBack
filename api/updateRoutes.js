const express = require('express');
const { updateData } = require('../controllers/updateController');

const router = express.Router();

// Definir la ruta POST para actualizar datos
router.post('/updateData', updateData);

module.exports = router;
