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
import { Like } from "../entities/like.entity";

export const postReport: RequestHandler = async (req, res, next) => {
    const { room_id, school_id, description, latitude, longitude, category_id, additional_infos } = req.body;
    const user_id = req.user_id;

    try {
        const user = await User.findOneByOrFail({ id: user_id });
        const category = await Category.findOneByOrFail({ id: category_id });
        const room = await Room.findOneByOrFail({ id: room_id });
        const school = await School.findOneByOrFail({ id: school_id });

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

        const allowEdit = report.user.id == user.id;
        req.body = {
            id: report.id,
            description: report.description,
            is_active: report.is_active,
            school: report.school.name,
            liked: report.likes?.find((val) => val.user.id == user_id)?.is_like,
            likes_count: report.likes?.filter((val) => val.is_like).length ?? 0,
            dislikes_count: report.likes?.filter((val) => !val.is_like).length ?? 0,
            comments_count: report.comments?.length,
            allow_edit: allowEdit,
            author: {
                id: report.user.id,
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
                id: report.category.id,
                name: report.category.name,
                type: report.category.type
            }
        };
        return next();
    } catch (err) {
        return next(err);
    }
}

export const getReports: RequestHandler = async (req, res, next) => {
    const { type, is_active, from_timestamp, to_timestamp, school_id, author_id } = req.body;
    const user_id = req.user_id;

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
                category: {
                    type: type
                },
                is_active: is_active,
                created_at: createdAtQuery,
                school: {
                    id: school_id
                },
                user: {
                    id: author_id,
                }
            },
            relations: {
                user: true,
                images: true,
                room: true,
                category: true,
                school: true,
                likes: {
                    user: true
                },
                comments: true,
            },
            order: {
                created_at: "DESC"
            }
        });

        const [reportData, total] = data;

        const reports = reportData.map((report) => {
            const allowEdit = report.user.id == user_id;
            return <unknown>{
                id: report.id,
                description: report.description,
                is_active: report.is_active,
                school: report.school.name,
                liked: report.likes?.find((val) => val.user.id == user_id)?.is_like,
                likes_count: report.likes?.filter((val) => val.is_like).length ?? 0,
                dislikes_count: report.likes?.filter((val) => !val.is_like).length ?? 0,
                comments_count: report.comments?.length,
                allow_edit: allowEdit,
                author: {
                    id: report.user.id,
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
                    id: report.category.id,
                    name: report.category.name,
                    type: report.category.type
                }
            };
        });

        return res.status(200).json(paginateResponse([reports, total], page, take));
    } catch (err) {
        return next(err);
    }
}

export const getReport: RequestHandler = async (req, res, next) => {
    const report_id = Number(req.params.id);
    const user_id = req.user_id;

    try {
        const report = await Report.findOne({
            where: { id: report_id },
            relations: {
                user: true,
                images: true,
                room: true,
                category: true,
                school: true,
                likes: {
                    user: true
                }
            }
        });

        if (!report) return next(createHttpError(404, `Report with id: ${report_id} does not exists`));

        const allowEdit = report.user.id == user_id;
        req.body = {
            id: report.id,
            description: report.description,
            is_active: report.is_active,
            school: report.school.name,
            liked: report.likes?.find((val) => val.user.id == user_id)?.is_like,
            likes_count: report.likes?.filter((val) => val.is_like).length ?? 0,
            dislikes_count: report.likes?.filter((val) => !val.is_like).length ?? 0,
            allow_edit: allowEdit,
            author: {
                id: report.user.id,
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
            room_id: report.room.id,
            category: {
                id: report.category.id,
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
    const id = Number(req.params.id);
    const { room_id, school_id, description, latitude, longitude, category_id, additional_infos, deleted_images, is_active } = req.body;
    console.log(req.body);

    const user_id = req.user_id;

    try {
        const report = await Report.findOne({ where: { id: id }, relations: { images: true, user: true, likes: { user: true }, comments: true } });
        if (!report) return next(createHttpError(400, `Report with id ${id} not found`));

        const user = await User.findOneByOrFail({ id: user_id });
        const room = await Room.findOneByOrFail({ id: room_id });
        const school = await School.findOneByOrFail({ id: school_id });
        const category = await Category.findOneByOrFail({ id: category_id });

        const imageFiles = req.files as Express.Multer.File[];

        const images = imageFiles.map((f) => {
            const image = new Image();
            image.file_path = f.path.replace(/\\/g, '/');
            return image;
        });

        if (deleted_images) {
            report.images.forEach(async (element) => {
                const imageExist = deleted_images.includes(element.file_path);
                if (imageExist) {
                    await element.remove();
                }
            });
        }

        const oldImages = await Image.find({ where: { report: { id: id } } });

        report.description = description;
        report.room = room;
        report.school = school;
        report.latitude = latitude;
        report.longitude = longitude;
        report.category = category;
        report.additional_infos = additional_infos;
        report.images = [...oldImages, ...images];
        report.is_active = is_active == 'true';

        await report.save();

        const updatedReport = await Report.findOne({
            where: { id: id },
            relations: {
                images: true,
                user: true,
                likes: { user: true },
                comments: true,
                school: true,
                room: true,
                category: true,
            }
        });
        if (!updatedReport) return next(createHttpError(400, 'Something went wrong, try again later'));

        const allowEdit = report.user.id == user.id;
        req.body = {
            id: updatedReport.id,
            description: updatedReport.description,
            is_active: updatedReport.is_active,
            school: updatedReport.school.name,
            liked: updatedReport.likes?.find((val) => val.user.id == user_id)?.is_like,
            likes_count: updatedReport.likes?.filter((val) => val.is_like).length ?? 0,
            dislikes_count: updatedReport.likes?.filter((val) => !val.is_like).length ?? 0,
            comments_count: updatedReport.comments?.length,
            allow_edit: allowEdit,
            author: {
                id: updatedReport.user.id,
                name: updatedReport.user.name,
                avatar: updatedReport.user.avatar_path
            },
            position: {
                latitude: updatedReport.latitude,
                longitude: updatedReport.longitude
            },
            created_at: updatedReport.created_at,
            images: updatedReport.images.map((image) => image.file_path),
            room: updatedReport.room.label,
            category: {
                id: updatedReport.category.id,
                name: updatedReport.category.name,
                type: updatedReport.category.type
            }
        };
        return next();
    } catch (err) {
        return next(err);
    }
}

export const deleteReport: RequestHandler = async (req, res, next) => {
    const report_id = Number(req.params.id);

    try {
        const report = await Report.findOneBy({ id: report_id });
        const result = await report?.remove();

        if (!result) return next(createHttpError(404, `Report with id: "${report_id}" does not exists`));

        req.body = { message: "delete report success" };
        return next();
    } catch (err) {
        return next(err);
    }
}

export const postLike: RequestHandler = async (req, res, next) => {
    const { user_id, is_like } = req.body;
    const report_id = Number(req.params.id);
    try {
        const report = await Report.findOneByOrFail({ id: report_id });
        const user = await User.findOneByOrFail({ id: user_id });

        const oldLike = await Like.findOne({ where: { user: { id: user_id }, report: { id: report_id } } });
        let like = new Like();

        if (oldLike) {
            if (oldLike.is_like == is_like) {
                req.body = {
                    message: 'report already liked'
                }
                return next();
            } else {
                like = oldLike;
            }
        }

        like.report = report;
        like.user = user;
        like.is_like = is_like;

        const newLike = await like.save();

        req.body = {
            id: newLike.id,
            user_id: newLike.user.id,
            report_id: newLike.report.id
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

export const deleteLike: RequestHandler = async (req, res, next) => {
    const user_id = req.body.user_id;
    const report_id = Number(req.params.id);
    try {
        const like = await Like.findOneOrFail({ where: { user: { id: user_id }, report: { id: report_id } } });
        await like.remove();

        req.body = {
            message: 'delete like success'
        }
        return next();
    } catch (err) {
        return next(err);
    }
}