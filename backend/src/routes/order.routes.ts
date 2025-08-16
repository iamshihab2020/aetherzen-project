import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { OrdersController } from "../controllers/order.controller";

const router = Router();
router.post("/", authMiddleware, OrdersController.create);
export default router;
