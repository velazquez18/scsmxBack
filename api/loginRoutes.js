// backend/routes/loginRoutes.js
const express = require('express');
const { loginWithRFID } = require('../controllers/loginController');

const router = express.Router();

// Ruta para login con RFID
router.post('/login', loginWithRFID);

// Exportar las rutas
module.exports = router;
