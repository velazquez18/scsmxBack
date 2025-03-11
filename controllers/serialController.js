import { SerialPort } from "serialport";

export const serialController = (io) => {
  const port = new SerialPort({
    path: "COM5",
    baudRate: 9600,
  });

  let RecibidosCOM1 = "";
  let pesoTara = 0; // Inicializar como 0
  let PxP = 0; // Valor por defecto para Peso por Pieza

  io.on("connection", (socket) => {
    console.log("Conectado exitosamente");

    port.on("data", (data) => {
      RecibidosCOM1 += data.toString();
      console.log("Datos recibidos desde la báscula:", RecibidosCOM1); // Depuración
      if (RecibidosCOM1.includes(String.fromCharCode(3))) {
        processReceivedData(socket);
        RecibidosCOM1 = "";
      }
    });

    socket.on("tareWeight", (data) => {
      pesoTara = parseFloat(data.pesoTara);
      console.log(`Peso Tara recibido: ${pesoTara}`);
    });

    // Escuchar el evento para actualizar PxP
    socket.on("updatePxP", (data) => {
      PxP = parseFloat(data.PxP) || 0; // Si no se recibe PxP, se usa 0
      console.log(`Peso por Pieza (PxP) actualizado: ${PxP}`);
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });

  port.on("open", () => {
    console.log("Puerto COM5 abierto");
  });

  port.on("error", (err) => {
    console.error(`Error en COM5: ${err.message}`);
  });

  const processReceivedData = (socket) => {
    try {
      // Verificar que los datos no estén vacíos
      if (!RecibidosCOM1 || typeof RecibidosCOM1 !== "string") {
        throw new Error("Datos recibidos no válidos.");
      }

      // Extraer el valor de peso bruto correctamente
      const valores = RecibidosCOM1.trim().split(/\s+/); // Dividir la cadena por espacios
      const pesoBrutoStr = valores[1]; // El segundo valor es el peso bruto
      const Brut = parseFloat(pesoBrutoStr); // Convertir a número

      console.log(`Peso bruto recibido: ${Brut}`); // Depuración: Verificar el valor

      // Verificar que el valor de peso bruto sea un número válido
      if (isNaN(Brut)) {
        throw new Error("Peso bruto no es un número válido.");
      }

      // Verificar que el peso bruto esté dentro del rango esperado
      if (Brut >= 0 && Brut <= 15) {
        const pesoNeto = Brut - pesoTara; // Calcular peso neto
        console.log(`Peso Neto: ${pesoNeto}`);

        // Enviar los valores al frontend
        socket.emit("weightData", {
          Brut: Brut.toString(), // Convertir a cadena
          pesoNeto: pesoNeto.toString(), // Convertir a cadena
        });
      } else {
        console.warn("Valor fuera del rango esperado, ignorando.");
      }
    } catch (ex) {
      console.error("Error procesando los datos recibidos:", ex);
    }
  };
};