import express from "express";
import errorHandler from "./middlewares/error.middleware";
import morgan from "morgan";
import createHttpError from "http-errors";
import { responseFormatter } from "./middlewares/response.middleware";
import "reflect-metadata"

import authRoutes from "./routes/auth.route";
import reportRoutes from "./routes/report.route";
import userRoutes from "./routes/user.route";
import schoolRoutes from "./routes/school.route";
import categoryRoutes from "./routes/category.route";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/api/auth", authRoutes, responseFormatter);
app.use("/api/report", reportRoutes, responseFormatter);
app.use("/api/user", userRoutes, responseFormatter);
app.use("/api/school", schoolRoutes, responseFormatter);
app.use("/api/category", categoryRoutes, responseFormatter);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use(errorHandler);

export default app;
