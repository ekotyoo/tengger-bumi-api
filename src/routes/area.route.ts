import express from "express";
import * as AreaController from "../controllers/area.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { categoryValidator } from "../validations/category.validator";

const router = express.Router();

router.post("/", requiresAuth, categoryValidator, AreaController.postArea);
router.get("/", requiresAuth, AreaController.getAreas);

export default router;