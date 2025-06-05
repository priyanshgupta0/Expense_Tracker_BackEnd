import { Router } from "express";
import authRoutes from "./authRoutes";
import groupRoutes from "./groupRoutes";
import expenseRoutes from "./expenseRoutes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/groups", groupRoutes);
router.use("/expenses", expenseRoutes);

export default router;
