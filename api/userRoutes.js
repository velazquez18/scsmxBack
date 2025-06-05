const express = require('express');
const { getPool, sql } = require('../dbConnection');

const router = express.Router();

router.post("/getUserData", async (req, res) => {
  const { rfid } = req.body;

  if (!rfid) {
    return res
      .status(400)
      .json({ message: "No se proporcionó el código RFID" });
  }

  const query = `
    SELECT 
      Nombre, 
      Apellido, 
      Tipo
    FROM dbo.Usuarios AS usuarios
    WHERE RfId = @rfid
  `;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("rfid", sql.VarChar, rfid)
      .query(query);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      console.log("Datos del usuario desde la base de datos:", user); // Verifica los datos

      // Concatenar Nombre y Apellido
      user.fullName = `${user.Nombre} ${user.Apellido}`;
      delete user.Nombre;
      delete user.Apellido;

      // Asignar el tipo
      user.tipo = `${user.Tipo}`;
      delete user.Tipo;

      res.json(user);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
});

module.exports = router;
