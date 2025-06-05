import express from "express";
import { createServer } from "http";
import { join } from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

// Configuración inicial
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

const app = express();
const appServer = createServer(app);

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

await Promise.all(
  routes.map(async (route) => {
    const module = await import(`./api/${route}.js`);
    app.use("/scsmx-api", module.default);
  })
);

// Servir frontend
app.use(express.static(join(__dirname, "..", "build")));
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "..", "build", "index.html"));
});

// Inicia servidor con LocalTunnel en producción
appServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);

  if (process.env.NODE_ENV === "production") {
    import("child_process").then(({ exec }) => {
      exec(`lt --port ${PORT} --subdomain scsmx-bascula`, (err, stdout) => {
        if (err) return console.error("❌ LocalTunnel error:", err);
        const url = stdout.match(/https:\/\/[^\s]+/)?.[0];
        if (url) console.log(`🌐 URL pública: ${url}`);
      });
    });
  }
});

// Manejo de cierre limpio
process.on("SIGINT", () => {
  console.log("\n🛑 Deteniendo servidor...");
  appServer.close(() => process.exit(0));
});
