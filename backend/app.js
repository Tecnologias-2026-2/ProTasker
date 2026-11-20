import cors from "cors";
import express from "express";
import helmet from "helmet";
import apiRoutes from "./routes/apiRoutes.js";

const defaultOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://protaskerhtml.web.app",
  "https://protaskerhtml.firebaseapp.com"
];

function allowedOrigins() {
  const configuredOrigins = process.env.FRONTEND_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set(configuredOrigins?.length ? configuredOrigins : defaultOrigins);
}

export function createApp() {
  const app = express();
  const origins = allowedOrigins();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.has(origin)) {
        callback(null, true);
        return;
      }
      const error = new Error("Este origen no está autorizado para acceder a la API.");
      error.status = 403;
      error.code = "cors/origin-not-allowed";
      callback(error);
    }
  }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });
  app.use("/api", apiRoutes);
  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "api/not-found", message: "La ruta solicitada no existe." }
    });
  });
  app.use((error, _request, response, _next) => {
    const status = Number.isInteger(error.status) ? error.status : 500;
    if (status >= 500) {
      console.error("Error en la API:", error);
    }
    response.status(status).json({
      error: {
        code: error.code || (status === 500 ? "api/internal" : "api/request-invalid"),
        message: status === 500 ? "Ocurrió un error interno. Inténtalo de nuevo." : error.message
      }
    });
  });

  return app;
}
