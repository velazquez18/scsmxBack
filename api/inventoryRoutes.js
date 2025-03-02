import express from "express";
import { getPool, sql } from "../dbConnection.js";

const router = express.Router();

router.post("/registrarInventario", async (req, res) => {
  const {
    Folio,
    OP,
    IdClie,
    IdProd,
    Var1,
    Var2,
    Var3,
    Emp,
    Pzas,
    PxP,
    Peso,
    Lote,
    IdEst,
    IdUsu,
    Fecha,
  } = req.body;

  console.log("Datos recibidos en el backend:", req.body); // Depuración

  // Verificar que los campos requeridos no sean nulos
  if (!OP || !IdClie || !IdProd || !Pzas || !Lote || !Peso) {
    console.error("Faltan campos requeridos:", {
      OP,
      IdClie,
      IdProd,
      Pzas,
      Lote,
      Peso,
    });
    return res.status(400).json({
      error: "Los campos OP, IdClie, IdProd, Pzas, Lote y Peso son requeridos.",
    });
  }

  try {
    const pool = await getPool();

    // Obtener el último Folio y aumentarlo en 1
    const folioQuery = await pool.request().query(`
  SELECT MAX(Folio) AS UltimoFolio FROM Inventario
`);
    console.log(
      "Resultado de la consulta del último Folio:",
      folioQuery.recordset
    ); // Depuración

    const ultimoFolio = folioQuery.recordset[0].UltimoFolio || 0;
    const nuevoFolio = ultimoFolio + 1;

    console.log("Nuevo Folio generado:", nuevoFolio); // Depuración // Depuración

    // Insertar el nuevo registro
    const query = `
      INSERT INTO Inventario (
        Folio, OP, IdClie, IdProd, Var1, Var2, Var3, Emp, Pzas, PxP, Peso, Lote, IdEst, IdUsu, Fecha
      ) VALUES (
        @Folio, @OP, @IdClie, @IdProd, @Var1, @Var2, @Var3, @Emp, @Pzas, @PxP, @Peso, @Lote, @IdEst, @IdUsu, @Fecha
      )
    `;

    await pool
      .request()
      .input("Folio", sql.Int, nuevoFolio)
      .input("OP", sql.NVarChar, OP)
      .input("IdClie", sql.NVarChar, IdClie)
      .input("IdProd", sql.NVarChar, IdProd)
      .input("Var1", sql.NVarChar, Var1)
      .input("Var2", sql.NVarChar, Var2)
      .input("Var3", sql.NVarChar, Var3)
      .input("Emp", sql.Int, Emp)
      .input("Pzas", sql.Int, Pzas)
      .input("PxP", sql.Float, PxP)
      .input("Peso", sql.Float, Peso)
      .input("Lote", sql.NVarChar, Lote)
      .input("IdEst", sql.NVarChar, IdEst || "1")
      .input("IdUsu", sql.NVarChar, IdUsu)
      .input("Fecha", sql.DateTime, Fecha)
      .query(query);

    console.log("Registro insertado correctamente en la base de datos."); // Depuración
    res.status(200).json({ message: "Registro exitoso." });
  } catch (error) {
    console.error("Error al registrar en inventario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
