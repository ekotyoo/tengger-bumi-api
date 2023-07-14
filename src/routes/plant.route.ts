import express from "express";
import * as PlantController from "../controllers/plant.controller";
import * as CommentController from "../controllers/comment.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";
import { reportValidator } from "../validations/report.validator";

const router = express.Router();

router.use(requiresAuth);

router.post("/", upload.array("images", 3), reportValidator, PlantController.postPlant);
router.get("/", PlantController.getPlants);
router.get("/:id", PlantController.getPlant);
router.put("/:id", upload.array("images", 3), PlantController.updatePlant);
router.delete("/:id", PlantController.deletePlant);
router.post("/:id/like", PlantController.postLike);
router.delete("/:id/like", PlantController.deleteLike);
router.delete("/:report_id/comment/:comment_id", CommentController.deleteComment);

export default router;