import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Between, MoreThan, LessThan } from "typeorm";
import { Image } from "../entities/image.entity";
import { Report } from "../entities/report.entity";
import { User } from "../entities/user.entity";
import { paginateResponse } from "../util/pagination";
import { Category } from "../entities/category.entity";
import { Room } from "../entities/room.entity";
import { School } from "../entities/school.entity";

export const postReport: RequestHandler = async (req, res, next) => {
    const { room_id, school_id, user_id, description, latitude, longitude, category_id, additional_infos } = req.body;

    try {
        const user = await User.findOneByOrFail({ uuid: user_id });
        const category = await Category.findOneByOrFail({ uuid: category_id });
        const room = await Room.findOneByOrFail({ uuid: room_id });
        const school = await School.findOneByOrFail({ uuid: school_id });

        const imageFiles = req.files as Express.Multer.File[];

        if (!imageFiles?.length) return next(createHttpError(400, "Image must not be empty"));

        const images = imageFiles.map((f) => {
            const image = new Image();
            image.file_path = f.path.replace(/\\/g, '/');
            return image;
        });

        const newReport = new Report();
        newReport.user = user;
        newReport.category = category;
        newReport.room = room;
        newReport.school = school;
        newReport.latitude = latitude;
        newReport.longitude = longitude;
        newReport.description = description;
        newReport.is_active = true;
        newReport.images = images;
        newReport.additional_infos = additional_infos;

        const report = await newReport.save();

        req.body = report;
        return next();
    } catch (err) {
        return next(err);
    }
}

export const getReports: RequestHandler = async (req, res, next) => {
    const { category, is_active, from_timestamp, to_timestamp, school_id } = req.body;

    const take = parseInt(req.query.take as string) || 20;
    const page = parseInt(req.query.page as string) || 1;

    let createdAtQuery;

    if (from_timestamp && to_timestamp) {
        createdAtQuery = Between(new Date(parseInt(from_timestamp) * 1000), new Date(parseInt(to_timestamp) * 1000));
    } else if (from_timestamp && !to_timestamp) {
        createdAtQuery = MoreThan(new Date(parseInt(from_timestamp) * 1000));
    } else if (!from_timestamp && to_timestamp) {
        createdAtQuery = LessThan(new Date(parseInt(to_timestamp) * 1000));
    }

    try {
        const data = await Report.findAndCount({
            take: take,
            skip: (page - 1) * take,
            where: {
                category: category,
                is_active: is_active,
                created_at: createdAtQuery,
                school: {
                    uuid: school_id
                }
            },
            relations: {
                user: true,
                images: true,
                room: true,
                category: true,
                school: true,
            },
            order: {
                created_at: "DESC"
            }
        });

        const [reportData, total] = data;

        const reports = reportData.map((report) => <unknown>{
            id: report.uuid,
            description: report.description,
            is_active: report.is_active,
            school: report.school.name,
            author: {
                id: report.user.uuid,
                name: report.user.name,
                avatar: report.user.avatar_path
            },
            position: {
                latitude: report.latitude,
                longitude: report.longitude
            },
            created_at: report.created_at,
            images: report.images.map((image) => image.file_path),
            room: report.room.label,
            category: {
                id: report.category.uuid,
                name: report.category.name,
                type: report.category.type
            }
        });

        return res.status(200).json(paginateResponse([reports, total], page, take));
    } catch (err) {
        return next(err);
    }
}

export const getReport: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    try {
        const report = await Report.findOne({
            where: { uuid: id },
            relations: {
                user: true,
                images: true,
                room: true,
                category: true,
                school: true,
            }
        });

        if (!report) return next(createHttpError(404, `Report with id: ${id} does not exists`));

        req.body = {
            id: report.uuid,
            description: report.description,
            is_active: report.is_active,
            school: report.school.name,
            author: {
                id: report.user.uuid,
                name: report.user.name,
                avatar: report.user.avatar_path
            },
            position: {
                latitude: report.latitude,
                longitude: report.longitude
            },
            created_at: report.created_at,
            images: report.images.map((image) => image.file_path),
            room: report.room.label,
            category: {
                id: report.category.uuid,
                name: report.category.name,
                type: report.category.type
            },
            additional_infos: report.additional_infos
        };
        return next();
    } catch (err) {
        return next(err);
    }
}

export const updateReport: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    const { description, is_active, latitude, longitude, category } = req.body;

    try {
        const updatedReport = await Report.findOneByOrFail({ uuid: id });

        if (description) updatedReport.description = description;
        if (is_active !== undefined) updatedReport.is_active = JSON.parse((is_active as string).toLowerCase());
        if (latitude) updatedReport.latitude = latitude;
        if (longitude) updatedReport.longitude = longitude;
        if (category) updatedReport.category = category;

        const report = await updatedReport.save()

        req.body = report;
        return next();
    } catch (err) {
        return next(err);
    }
}

export const deleteReport: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    try {
        const report = await Report.findOneBy({ uuid: id });
        const result = await report?.remove();

        if (!result) return next(createHttpError(404, `Report with id: "${id}" does not exists`));

        req.body = { message: "delete report success" };
        return next();
    } catch (err) {
        return next(err);
    }
}