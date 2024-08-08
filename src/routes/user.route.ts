import express from "express"
import * as UserController from "../controllers/user.controller"
import * as PlantController from "../controllers/plant.controller"
import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";

const router = express.Router();

router.get("/:id", requiresAuth, UserController.getUser);
router.get("/:id/stats", requiresAuth, UserController.getUserStats);
router.put("/:id", requiresAuth, upload.single("avatar"), UserController.updateUser);
router.get("/:id/bookmarks", PlantController.getBookmarks);

export default router;