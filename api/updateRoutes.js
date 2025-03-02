import express from 'express';
import { updateData } from '../controllers/updateController.js';

const router = express.Router();

// Definir la ruta POST para actualizar datos
router.post('/updateData', updateData);

export default router;