import express from "express";
import { getMyOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/orders/mine
router.get("/mine", protect, getMyOrders);

export default router;

