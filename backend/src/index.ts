import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes";
import { globalLimiter } from "./middlewares/rate-limiter";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(globalLimiter);
app.use("/public", express.static(path.join(__dirname, "..", "public")));

app.use("/auth", authRoutes);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
