import sql from 'mssql';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de la conexión usando variables de entorno
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',  // Convertir a booleano
        enableArithAbort: true,
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',  // Convertir a booleano
        requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT, 10),  // Convertir a número
    },
};

// Crear una promesa para manejar la conexión
let poolPromise = sql.connect(config)
    .then(pool => {
        console.log('Conexión exitosa a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err);
        throw err;
    });

// Exportar tanto la promesa como el objeto sql para usarlos en otros archivos
export const getPool = () => poolPromise; // Usamos getPool() para obtener la conexión
export { sql };