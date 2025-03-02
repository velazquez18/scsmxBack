import express from 'express';
import { createServer } from "http";
import { join } from "path";
import cors from 'cors';
import bodyParser from "body-parser";
import countRoutes from './api/countRoutes.js'; // Actualizado a la carpeta api
import opRoutes from './api/opRoutes.js'; // Actualizado a la carpeta api
import samplingRoutes from './api/samplingRoutes.js'; // Actualizado a la carpeta api
import loginRoutes from './api/loginRoutes.js'; // Actualizado a la carpeta api
import userRoutes from './api/userRoutes.js'; // Actualizado a la carpeta api
import { serialController } from './controllers/serialController.js';
import updateRoutes from './api/updateRoutes.js'; // Actualizado a la carpeta api
import inventoryRoutes from './api/inventoryRoutes.js'; // Actualizado a la carpeta api
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

// Obtener __dirname en un entorno ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Crear servidor HTTP
const appServer = createServer(app);

// Habilitar CORS en Express
const corsOptions = {
  origin: 'http://localhost:3000', // Cambia esto si usas otro dominio o puerto en el frontend
  methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));

// Crear instancia de Socket.IO con CORS habilitado
const io = new Server(appServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Usar middleware y body-parser
app.use(express.json());
app.use(bodyParser.json());

// Usar rutas existentes
app.use('/api', countRoutes);
app.use('/api', samplingRoutes);
app.use('/api', loginRoutes);
app.use('/api', userRoutes);
app.use('/api', opRoutes);
app.use('/api', updateRoutes);
app.use('/api', inventoryRoutes);

// Inicializar el controlador del puerto serial con socket.io
serialController(io);

// Servir archivos estáticos desde la carpeta build de frontend
app.use(express.static(join(__dirname, '..', 'build')));

// Ruta para servir el archivo HTML principal
app.get('/*', (req, res) => {  // Ajuste para capturar cualquier ruta no gestionada por la API
  res.sendFile(join(__dirname, '..', 'build', 'index.html'));
});

// Iniciar el servidor
appServer.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});