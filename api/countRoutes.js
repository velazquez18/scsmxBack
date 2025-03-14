import express from "express";
import { getPool, sql } from "../dbConnection.js"; // Importar getPool y sql desde dbConnection.js
const router = express.Router();

router.get("/getDataByQr", async (req, res) => {
  const qr = req.query.qr; // El QR viene en la URL como parámetro
  console.log("QR recibido:", qr); // Para depuración

  try {
    // Verificar que se recibió el parámetro QR
    if (!qr) {
      return res.status(400).json({ error: "Parámetro QR es requerido" });
    }

    // Descomponer los valores del QR
    const qrValues = qr.split("|");
    if (qrValues.length !== 6) {
      return res.status(400).json({ error: "Formato de QR inválido" });
    }

    const [OP, IdClie, IdProd, Emp, Pzas, Lote] = qrValues;

    // Definir la consulta SQL
    const query = `
  SELECT
        OP.IdProd AS IdProd,
        OP.IdClie AS IdClie,
        Clientes.Nombre AS nombreCliente,
        Productos.Nombre AS nombreProducto,
        OP.Pzas AS Pzas,
        OP.Emp AS Emp,
        Productos.PxP AS PxP,
        OP.Lote AS Lote,
        Productos.Var1 AS Var1,
        Productos.Var2 AS Var2,
        Productos.Var3 AS Var3,
        Clientes.Imagen AS Imagen, 
        OP.OP AS OP,
        Usuarios.IdUsu AS IdUsu
      FROM dbo.OP AS OP
      JOIN dbo.Clientes AS Clientes ON OP.IdClie = Clientes.IdClie
      JOIN dbo.Productos AS Productos ON OP.IdProd = Productos.IdProd
      JOIN dbo.Usuarios AS Usuarios ON OP.IdUsu = Usuarios.IdUsu
      WHERE OP.OP = @OP
        AND OP.IdClie = @IdClie 
        AND OP.IdProd = @IdProd 
        AND OP.Emp = @Emp 
        AND OP.Pzas = @Pzas 
        AND OP.Lote = @Lote;
    `;

    // Obtener la conexión del pool
    const pool = await getPool();

    // Ejecutar la consulta
    const result = await pool
      .request()
      .input("OP", sql.NVarChar, OP)
      .input("IdClie", sql.NVarChar, IdClie)
      .input("IdProd", sql.NVarChar, IdProd)
      .input("Emp", sql.Int, Emp)
      .input("Pzas", sql.Int, Pzas)
      .input("Lote", sql.NVarChar, Lote)
      .query(query);

    console.log("Resultado de la consulta:", result.recordset); // Depuración

    if (result.recordset.length > 0) {
      const data = result.recordset[0];
      console.log("Datos obtenidos:", data); // Depuración
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Datos no encontrados" }); // Si no se encuentran datos
    }
  } catch (error) {
    console.error("Error al procesar QR:", error); // Imprimir el error en consola
    res.status(500).json({ error: "Error en el servidor" }); // Responder con un error 500
  }
});

export default router;

// // Ruta para obtener los datos de la tabla OP
// router.get("/op", async (req, res) => {
//   try {
//     // Obtener la conexión del pool
//     const pool = await db.getPool();

//     // Realizar la consulta a la tabla OP
//     const result = await pool.query("SELECT * FROM dbo.OP");

//     // Enviar los datos como respuesta en formato JSON
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("Error consultando la base de datos:", err);
//     res.status(500).send("Error al obtener los datos");
//   }
// });

// // Ruta para obtener los datos de la tabla Clientes
// router.get("/clientes", async (req, res) => {
//   try {
//     // Obtener la conexión del pool
//     const pool = await db.getPool();

//     // Realizar la consulta a la tabla Clientes
//     const result = await pool.query("SELECT * FROM dbo.Clientes");

//     // Enviar los datos como respuesta en formato JSON
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("Error consultando la base de datos:", err);
//     res.status(500).send("Error al obtener los datos");
//   }
// });

// // Ruta para obtener los datos de la tabla Productos
// router.get("/productos", async (req, res) => {
//   try {
//     // Obtener la conexión del pool
//     const pool = await db.getPool();

//     // Realizar la consulta a la tabla Productos
//     const result = await pool.query("SELECT * FROM dbo.Productos");

//     // Enviar los datos como respuesta en formato JSON
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("Error consultando la base de datos:", err);
//     res.status(500).send("Error al obtener los datos");
//   }
// });
