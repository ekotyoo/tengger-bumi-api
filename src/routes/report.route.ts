import express from "express";
import * as ReportController from "../controllers/report.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/upload.config";
import { reportValidator } from "../validations/report.validator";

const router = express.Router();

router.use(requiresAuth);

router.post("/", upload.array("images", 3), reportValidator, ReportController.postReport);
router.get("/", ReportController.getReports);
router.get("/:id", ReportController.getReport);
router.put("/:id", ReportController.updateReport);
router.delete("/:id", ReportController.deleteReport);
router.post("/:id/like", ReportController.postLike);
router.delete("/:id/like", ReportController.deleteLike);

export default router;