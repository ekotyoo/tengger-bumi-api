import express from "express";
import * as AreaController from "../controllers/area.controller";
import { requiresAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/provinces", requiresAuth, AreaController.getProvinces);
router.get("/regencies", requiresAuth, AreaController.getAllRegencies);
router.get("/regencies/:province_id", requiresAuth, AreaController.getRegencies);
router.get("/districts/:regency_id", requiresAuth, AreaController.getDistricts);
router.get("/villages/:district_id", requiresAuth, AreaController.getVillages);

export default router;