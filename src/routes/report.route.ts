import express from "express";
import * as ReportController from "../controllers/report.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";
import { reportValidator } from "../validations/report.validator";

const router = express.Router();

router.post("/", requiresAuth, upload.array("images", 3), reportValidator, ReportController.postReport);
router.get("/", requiresAuth, ReportController.getReports);
router.get("/:id", requiresAuth, ReportController.getReport);
router.put("/:id", requiresAuth, ReportController.updateReport);
router.delete("/:id", requiresAuth, ReportController.deleteReport);
router.post("/:id/like", requiresAuth, ReportController.postLike);
router.delete("/:id/like", requiresAuth, ReportController.deleteLike);

export default router;