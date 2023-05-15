import { DataSource } from "typeorm";
import { Image } from "../entities/image.entity";
import { Report } from "../entities/report.entity";
import { User } from "../entities/user.entity";
import env from "../util/env";
import { School } from "../entities/school.entity";
import { SchoolAnalysis } from "../entities/school_analysis.entity";
import { Room } from "../entities/room.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    entities: [User, Report, Image, School, SchoolAnalysis, Room],
    synchronize: true,
    logging: false,
});