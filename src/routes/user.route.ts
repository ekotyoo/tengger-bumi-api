import express from "express"
import * as UserController from "../controllers/user.controller"
import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";

const router = express.Router();

router.get("/:id", requiresAuth, UserController.getUser);
router.get("/:id/stats", requiresAuth, UserController.getUserStats);
router.put("/:id", requiresAuth, upload.single("avatar"), UserController.updateUser);

export default router;