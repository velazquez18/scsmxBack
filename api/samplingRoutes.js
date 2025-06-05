const express = require("express");
const { getPool, sql } = require("../dbConnection");

const router = express.Router();

// Ruta para obtener datos por IdProd
router.get("/getDataById", async (req, res) => {
  const id = req.query.id;
  console.log("IdProducto recibido:", id);

  if (!id) {
    return res.status(400).json({ message: "No se proporcionó el IdProd" });
  }

  try {
    const pool = await getPool();

    const query = `
      SELECT 
        Productos.IdProd AS IdProd,
        Productos.Nombre AS nombreProducto,
        Productos.PxP AS PxP,
        Productos.Var1 AS Var1,
        Productos.Var2 AS Var2,
        Productos.Var3 AS Var3,
        Productos.Imagen AS Imagen
      FROM dbo.Productos AS Productos
      WHERE Productos.IdProd = @IdProd
    `;

    const result = await pool
      .request()
      .input("IdProd", sql.NVarChar, id)
      .query(query);

    if (result.recordset.length > 0) {
      const data = result.recordset[0];
      console.log("Datos obtenidos:", data);
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error en la consulta de datos por IdProd:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

module.exports = router;
