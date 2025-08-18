import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.routes";
import { globalLimiter } from "./middlewares/rate-limiter";
import productsRoutes from "./routes/products.routes";
import categoryRoutes from "./routes/category.routes";
import prescriptionsRouter from "./routes/prescriptions.routes";
import ordersRouter from "./routes/order.routes";

dotenv.config();
const app = express();

// Ensure private directory exists on boot (defense in depth)
const privateDir = path.join(__dirname, "..", "private", "prescriptions");
if (!fs.existsSync(privateDir)) {
  fs.mkdirSync(privateDir, { recursive: true });
}

const corsOptions = {
  origin: "http://localhost:3000", // Your frontend origin
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(globalLimiter);

// Static files
app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use(
  "/certifications",
  express.static(path.join(__dirname, "..", "public", "certifications"))
);

// Routes
app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/categories", categoryRoutes);
app.use("/prescriptions", prescriptionsRouter);
app.use("/orders", ordersRouter);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
