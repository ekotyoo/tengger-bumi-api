import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Between, MoreThan, LessThan } from "typeorm";
import { Image } from "../entities/image.entity";
import { Report } from "../entities/report.entity";
import { User } from "../entities/user.entity";
import { paginateResponse } from "../util/pagination";

export const postReport: RequestHandler = async (req, res, next) => {
    const { user_id, description, is_active, latitude, longitude, category } = req.body;

    try {
        const user = await User.findOneByOrFail({ uuid: user_id });
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
        newReport.latitude = latitude;
        newReport.longitude = longitude;
        newReport.description = description;
        newReport.is_active = JSON.parse((is_active as string).toLowerCase());
        newReport.images = images;

        const report = await newReport.save();

        req.body = report;
        return next();
    } catch (err) {
        return next(err);
    }
}

export const getReports: RequestHandler = async (req, res, next) => {
    const { category, is_active, from_timestamp, to_timestamp } = req.body;

    const take = parseInt(req.query.take as string) || 10;
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
                is_active: is_active === undefined ? undefined : JSON.parse((is_active as string).toLowerCase()),
                created_at: createdAtQuery
            },
            relations: {
                images: true
            },
            order: {
                created_at: "DESC"
            }
        });
        return res.status(200).json(paginateResponse(data, page, take));
    } catch (err) {
        return next(err);
    }
}

export const getReport: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    try {
        const report = await Report.findOne({
            where: { uuid: id },
            relations: { images: true }
        });

        if (!report) return next(createHttpError(404, `Report with id: ${id} does not exists`));

        req.body = report;
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