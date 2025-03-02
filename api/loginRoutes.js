// backend/routes/loginRoutes.js
import express from 'express';
import { loginWithRFID } from '../controllers/loginController.js';

const router = express.Router();

// Ruta para login con RFID
router.post('/login', loginWithRFID);

// Exportar las rutas
export default router;
