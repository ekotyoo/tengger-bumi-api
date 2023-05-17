import express from "express";
import * as CommentController from "../controllers/comment.controller";
import { requiresAuth } from "../middlewares/auth.middleware";
import { commentValidator } from "../validations/comment.validator";

const router = express.Router();

router.post("/", requiresAuth, commentValidator, CommentController.postComment);
router.get("/", requiresAuth, CommentController.getComments);

export default router;