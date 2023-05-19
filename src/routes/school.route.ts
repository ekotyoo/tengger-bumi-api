import express from "express";
import * as SchoolController from "../controllers/school.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";
import { schoolValidator } from "../validations/school.validator";

const router = express.Router();

router.use(requiresAuth);

router.post("/", upload.single("image"), schoolValidator, SchoolController.postSchool);
router.get("/", SchoolController.getSchools);
router.get("/:id", SchoolController.getSchool);

export default router;