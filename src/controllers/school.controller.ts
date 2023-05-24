import { RequestHandler } from "express";
import { School } from "../entities/school.entity";
import { Room } from "../entities/room.entity";
import { SchoolAnalysis } from "../entities/school_analysis.entity";
import { Like } from "typeorm";
import createHttpError from "http-errors";
import { User } from "../entities/user.entity";

interface RoomBody {
    label: string
    color: string
    polygon: JSON[]
}

export const postSchool: RequestHandler = async (req, res, next) => {
    const { name, address, floor_plan, centroid } = req.body;

    try {
        const rawImage = req.file;

        const rooms = (floor_plan.rooms as RoomBody[]).map((r) => {
            const room = new Room();
            room.label = r.label;
            room.color = r.color;
            room.polygon = r.polygon;
            return room;
        });

        const newSchool = new School();
        newSchool.name = name;
        newSchool.address = address;
        newSchool.rooms = rooms;
        newSchool.latitude = centroid.latitude;
        newSchool.longitude = centroid.longitude;
        newSchool.school_analysis = new SchoolAnalysis();

        if (rawImage) {
            newSchool.cover_image_path = rawImage.path.replace(/\\/g, '/');
        }

        const school = await newSchool.save();

        req.body = school;
        next();
    } catch (err) {
        next(err);
    }
};

export const updateSchool: RequestHandler = async (req, res, next) => {
    const { name, address } = req.body;
    const id = Number(req.params.id);

    try {
        const school = await School.findOne({ where: { id: id }, relations: { school_analysis: true } });
        if (!school) return next(createHttpError(400, `School with id ${id} does not exists`));

        const rawImage = req.file;
        if (rawImage) {
            school.cover_image_path = rawImage.path.replace(/\\/g, '/');
        } else {
            school.cover_image_path = null;
        }
        school.name = name;
        school.address = address;

        const updatedSchool = await school.save()

        req.body = {
            id: updatedSchool.id,
            name: updatedSchool.name,
            address: updatedSchool.address,
            image: updatedSchool.cover_image_path,
            centroid: {
                latitude: updatedSchool.latitude,
                longitude: updatedSchool.longitude
            },
            analysis: {
                prevention_level: updatedSchool.school_analysis.prevention_level,
                emergency_response_level: updatedSchool.school_analysis.emergency_response_level,
                recovery_level: updatedSchool.school_analysis.recovery_level
            },
            created_at: updatedSchool.created_at,
        }
        next();
    } catch (err) {
        return next(err);
    }
}

export const getSchools: RequestHandler = async (req, res, next) => {
    try {
        const query = req.query.name ?? '';
        const user_id = req.user_id;

        const user = await User.findOneByOrFail({ id: user_id });

        const data = await School.find({
            relations: { school_analysis: true }, where: {
                name: Like(`%${query}%`)
            }
        });
        const schools = data.map((school) => <unknown>{
            id: school.id,
            name: school.name,
            address: school.address,
            image: school.cover_image_path,
            centroid: {
                latitude: school.latitude,
                longitude: school.longitude
            },
            analysis: {
                prevention_level: school.school_analysis.prevention_level,
                emergency_response_level: school.school_analysis.emergency_response_level,
                recovery_level: school.school_analysis.recovery_level
            },
            created_at: school.created_at,
            allow_edit: user.is_admin,
        });
        req.body = schools;
        next();
    } catch (err) {
        next(err);
    }
}

export const getSchool: RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const user_id = req.user_id;

        const user = await User.findOneByOrFail({ id: user_id });
        const school = await School.findOne({
            where: { id: id },
            relations: { school_analysis: true, rooms: true },
        });

        if (!school) return next(createHttpError(404, `Report with id: ${id} does not exists`));

        req.body = {
            id: school.id,
            name: school.name,
            address: school.address,
            image: school.cover_image_path,
            centroid: {
                latitude: school.latitude,
                longitude: school.longitude
            },
            created_at: school.created_at,
            analysis: {
                prevention_level: school.school_analysis.prevention_level,
                emergency_response_level: school.school_analysis.emergency_response_level,
                recovery_level: school.school_analysis.recovery_level
            },
            floor_plan: {
                rooms: school.rooms.map((r) => <unknown>{
                    id: r.id,
                    label: r.label,
                    color: r.color,
                    polygon: r.polygon,
                }),
            },
            allow_edit: user.is_admin,
        };
        next();
    } catch (err) {
        next(err);
    }
}