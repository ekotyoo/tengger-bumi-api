import { DataSource } from "typeorm";
import { Image } from "../entities/image.entity";
import { Plant } from "../entities/plant.entity";
import { User } from "../entities/user.entity";
import env from "../util/env";
import { Category } from "../entities/category.entity";
import { Comment } from "../entities/comment.entity";
import { Like } from "../entities/like.entity";
import { Area } from "../entities/area.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    entities: [User, Plant, Image, Category, Comment, Like, Area],
    synchronize: true,
    logging: false,
});