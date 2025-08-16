import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes";
import { globalLimiter } from "./middlewares/rate-limiter";
import productsRoutes from "./routes/products.routes";
import categoryRoutes from "./routes/category.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(globalLimiter);
app.use("/public", express.static(path.join(__dirname, "..", "public")));

app.use("/auth", authRoutes);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(
  "/certifications",
  express.static(path.join(__dirname, "..", "public", "certifications"))
);

app.use("/products", productsRoutes);
app.use("/categories", categoryRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
