import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import adminCertificateRoutes from "./routes/certificate.routes.js";
import adminStudentRoutes from "./routes/student.routes.js";
import publicRoutes from "./routes/public.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (corsOrigins.length === 0 || corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    }
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin/certificates", adminCertificateRoutes);
app.use("/api/admin/students", adminStudentRoutes);
app.use("/api", publicRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${port}`);
});
