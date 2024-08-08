import express from "express";
import errorHandler from "./middlewares/error.middleware";
import morgan from "morgan";
import createHttpError from "http-errors";
import { responseFormatter } from "./middlewares/response.middleware";
import "reflect-metadata"

import authRoutes from "./routes/auth.route";
import reportRoutes from "./routes/plant.route";
import userRoutes from "./routes/user.route";
import categoryRoutes from "./routes/category.route";
import commentRoutes from "./routes/comment.route";
import areaRoutes from "./routes/area.route";
import * as PlantController from "./controllers/plant.controller";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => { return res.send("Tetenger Bumi API") });
app.use("/api/auth", authRoutes, responseFormatter);
app.use("/api/plant", reportRoutes, responseFormatter);
app.use("/api/comment", commentRoutes, responseFormatter);
app.use("/api/user", userRoutes, responseFormatter);
app.use("/api/category", categoryRoutes, responseFormatter);
app.use("/api/area", areaRoutes, responseFormatter);
app.use("/api/stats", PlantController.getGlobalStats, responseFormatter);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use(errorHandler);

export default app;
