const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// Configuración inicial
dotenv.config();
const __filename = __filename || require("url").fileURLToPath(import.meta.url); // Fallback en entornos mixtos
const __dirname = __dirname || path.dirname(__filename);
const PORT = process.env.PORT || 3001;

const app = express();

// Configuración mejorada de CORS
const corsOptions = {
  origin: [
    "http://siaumex-001-site2.mtempurl.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Rutas API (ajusta según tus imports)
const routes = [
  "countRoutes",
  "samplingRoutes",
  "loginRoutes",
  "userRoutes",
  "opRoutes",
  "updateRoutes",
  "inventoryRoutes",
];

routes.forEach((route) => {
  const routeModule = require(`./api/${route}.js`);
  app.use("/scsmx-api", routeModule);
});

// Servir frontend
app.use(express.static(join(__dirname, "..", "build")));
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);

  if (process.env.NODE_ENV === "production") {
    const { exec } = require("child_process");
    exec(`lt --port ${PORT} --subdomain scsmx-bascula`, (err, stdout) => {
      if (err) return console.error("❌ LocalTunnel error:", err);
      const url = stdout.match(/https:\/\/[^\s]+/)?.[0];
      if (url) console.log(`🌐 URL pública: ${url}`);
    });
  }
});

// Manejo de cierre limpio
process.on("SIGINT", () => {
  console.log("\n🛑 Deteniendo servidor...");
  app.close(() => process.exit(0));
});
