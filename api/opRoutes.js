const express = require("express");
const { getPool, sql } = require("../dbConnection");

const router = express.Router();

// Ruta para obtener datos de la orden de producción
router.get("/getOrdenProduccion", async (req, res) => {
  try {
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
      WHERE OP.Estatus = 1;
    `;

    const pool = await getPool();
    const result = await pool.request().query(query);

    if (result.recordset.length > 0) {
      const formattedData = result.recordset.map((row) => ({
        ...row,
        Fecha: new Date(row.Fecha).toISOString().replace(".000Z", ""),
      }));

      console.log("Datos formateados:", formattedData);
      res.json(formattedData);
    } else {
      res.status(404).json({ error: "Datos no encontrados" });
    }
  } catch (error) {
    console.error("Error al obtener datos de la orden de producción:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
