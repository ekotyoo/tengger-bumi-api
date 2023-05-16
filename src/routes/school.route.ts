import express from "express";
import * as SchoolController from "../controllers/school.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";
import { schoolValidator } from "../validations/school.validator";

const router = express.Router();

router.post("/", requiresAuth, upload.single("image"), schoolValidator, SchoolController.postSchool);
router.get("/", requiresAuth, SchoolController.getSchools);
router.get("/:id", requiresAuth, SchoolController.getSchool);

export default router;