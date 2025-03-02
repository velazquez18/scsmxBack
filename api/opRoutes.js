import express from "express";
import { getPool, sql } from "../dbConnection.js"; // Importar getPool y sql desde dbConnection.js
const router = express.Router();

// Ruta para obtener datos de la orden de producción
router.get("/getOrdenProduccion", async (req, res) => {
  try {
    // Definir la consulta SQL
    const query = `
      SELECT
        OP.OP AS OP,
        Clientes.Nombre AS Cliente,
        Productos.Nombre AS Producto,
        OP.Emp AS Emp,
        OP.Fecha AS Fecha
      FROM dbo.OP AS OP
      JOIN dbo.Clientes AS Clientes ON OP.IdClie = Clientes.IdClie
      JOIN dbo.Productos AS Productos ON OP.IdProd = Productos.IdProd
      WHERE OP.Estatus = 1; -- Filtra solo los registros con Estatus = 1
    `;

    // Obtener la conexión del pool
    const pool = await getPool(); // Llamada a getPool() directamente

    // Ejecutar la consulta
    const result = await pool.request().query(query); // Ejecutar la consulta

    if (result.recordset.length > 0) {
      // Responder con los datos encontrados
      res.json(result.recordset);
    } else {
      res.status(404).json({ error: "Datos no encontrados" }); // Si no se encuentran datos
    }
  } catch (error) {
    console.error("Error al obtener datos de la orden de producción:", error); // Imprimir el error en consola
    return res.status(500).json({ error: "Error en el servidor" }); // Responder con un error 500
  }
});

export default router;