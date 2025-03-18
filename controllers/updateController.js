import { getPool, sql } from '../dbConnection.js';

const updateData = async (req, res) => {
  const { IdProd, pesoxPieza } = req.body;

  console.log("Datos recibidos:", { IdProd, pesoxPieza }); // Log para depuración

  if (!IdProd || !pesoxPieza) {
    return res.status(400).json({ error: "Faltan datos requeridos." });
  }

  try {
    const pool = await getPool();

    // Query para actualizar solo el campo PxP
    const query = `
      UPDATE Productos
      SET PxP = @pesoxPieza
      WHERE IdProd = @IdProd
    `;

    const result = await pool
      .request()
      .input('IdProd', sql.NVarChar, IdProd)
      .input('pesoxPieza', sql.Decimal(10, 4), pesoxPieza)
      .query(query);

    console.log("Resultado de la consulta:", result); // Log para depuración

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Datos actualizados correctamente." });
    } else {
      res.status(404).json({ error: "Producto no encontrado." });
    }
  } catch (error) {
    console.error("Error al actualizar los datos:", error);
    res.status(500).json({ error: "Error al actualizar los datos en la base de datos." });
  }
};

export { updateData };