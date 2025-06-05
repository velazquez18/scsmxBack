const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        enableArithAbort: true,
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
        requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT, 10),
    },
};

// Crear una promesa para manejar la conexión
let poolPromise = sql
    .connect(config)
    .then((pool) => {
        console.log("Conexión exitosa a SQL Server");
        return pool;
    })
    .catch((err) => {
        console.error("Error conectando a la base de datos:", err);
        throw err;
    });

const getPool = () => poolPromise;

module.exports = {
    getPool,
    sql,
};
