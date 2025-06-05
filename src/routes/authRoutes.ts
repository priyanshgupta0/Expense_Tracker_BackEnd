import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/auth.controller";
import { protect } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.use(protect);
router.get("/profile", getUserProfile);

export default router;
