import { getPool, sql } from "../dbConnection.js";

export async function loginWithRFID(req, res) {
  const { rfid } = req.body;  // Obtener el RFID del cuerpo de la solicitud
  console.log("RFID recibido en el backend:", rfid);

  try {
    const pool = await getPool(); // Obtener la conexión desde el pool
    const result = await pool
      .request() // Crear la solicitud
      .input("rfid", sql.VarChar, rfid) // Pasar el RFID como parámetro
      .query("SELECT * FROM Usuarios WHERE RfId = @rfid");

    if (result.recordset.length > 0) {
      res.json({ success: true, message: "Login exitoso" });
    } else {
      res.status(401).json({ success: false, message: "RFID no válido" });
    }
  } catch (error) {
    console.error("Error en loginWithRFID:", error);
    res.status(500).json({ success: false, message: "Error de servidor" });
  }
}
const { getPool, sql } = require("../dbConnection");

async function loginWithRFID(req, res) {
  const { rfid } = req.body;  // Obtener el RFID del cuerpo de la solicitud
  console.log("RFID recibido en el backend:", rfid);

  try {
    const pool = await getPool(); // Obtener la conexión desde el pool
    const result = await pool
      .request() // Crear la solicitud
      .input("rfid", sql.VarChar, rfid) // Pasar el RFID como parámetro
      .query("SELECT * FROM Usuarios WHERE RfId = @rfid");

    if (result.recordset.length > 0) {
      res.json({ success: true, message: "Login exitoso" });
    } else {
      res.status(401).json({ success: false, message: "RFID no válido" });
    }
  } catch (error) {
    console.error("Error en loginWithRFID:", error);
    res.status(500).json({ success: false, message: "Error de servidor" });
  }
}

module.exports = { loginWithRFID };
