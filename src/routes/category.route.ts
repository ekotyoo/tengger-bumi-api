import express from "express";
import * as CategoryController from "../controllers/category.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { categoryValidator } from "../validations/category.validator";

const router = express.Router();

router.post("/", requiresAuth, categoryValidator, CategoryController.postCategory);
router.get("/", requiresAuth, CategoryController.getCategories);

export default router;