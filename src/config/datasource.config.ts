import { DataSource } from "typeorm";
import { Image } from "../entities/image.entity";
import { Report } from "../entities/report.entity";
import { User } from "../entities/user.entity";
import env from "../util/env";
import { School } from "../entities/school.entity";
import { Room } from "../entities/room.entity";
import { Category } from "../entities/category.entity";
import { Comment } from "../entities/comment.entity";
import { Like } from "../entities/like.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    entities: [User, Report, Image, School, Room, Category, Comment, Like],
    synchronize: true,
    logging: false,
});