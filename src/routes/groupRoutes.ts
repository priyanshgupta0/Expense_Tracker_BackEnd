import express, { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createGroup,
  getGroups,
  getGroupById,
  addMember,
} from "../controllers/group.controller";

const router: Router = express.Router();

// Protect all routes
router.use(protect);

// Group routes
router.route("/").post(createGroup).get(getGroups);

router.route("/:id").get(getGroupById);

router.route("/:groupId/users").post(addMember);

export default router;
