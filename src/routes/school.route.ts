import express from "express";
import * as SchoolController from "../controllers/school.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";
import { schoolValidator } from "../validations/school.validator";

const router = express.Router();

router.post("/", requiresAuth, upload.single("image"), SchoolController.postSchool);

export default router;