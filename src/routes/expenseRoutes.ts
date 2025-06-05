import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createExpense,
  getGroupExpenses,
  calculateGroupBalances,
} from "../controllers/expense.controller";

const router = express.Router();

// Protect all routes
router.use(protect);

// Group expense routes
router
  .route("/:groupId")
  .post(createExpense as unknown as express.RequestHandler)
  .get(getGroupExpenses as unknown as express.RequestHandler);

router
  .route("/:groupId/balance-sheet")
  .get(calculateGroupBalances as unknown as express.RequestHandler);

export default router;
