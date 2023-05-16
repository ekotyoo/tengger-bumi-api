import { RequestHandler } from "express";
import { School } from "../entities/school.entity";
import { Room } from "../entities/room.entity";
import { SchoolAnalysis } from "../entities/school_analysis.entity";
import { Like } from "typeorm";
import createHttpError from "http-errors";

interface RoomBody {
    label: string
    color: string
    polygon: JSON[]
}

export const postSchool: RequestHandler = async (req, res, next) => {
    const { school_name, school_address, floor_plan } = req.body;

    try {
        const rawImage = req.file;

        console.log(rawImage);

        const rooms = (floor_plan.rooms as RoomBody[]).map((r) => {
            const room = new Room();
            console.log(r);
            room.label = r.label;
            room.color = r.color;
            room.polygon = r.polygon;
            return room;
        });

        const newSchool = new School();
        newSchool.name = school_name;
        newSchool.address = school_address;
        newSchool.rooms = rooms;
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

export const getSchools: RequestHandler = async (req, res, next) => {
    try {
        const query = req.query.name ?? '';

        const data = await School.find({
            relations: { school_analysis: true }, where: {
                name: Like(`%${query}%`)
            }
        });
        const schools = data.map((school) => <unknown>{
            id: school.uuid,
            name: school.name,
            address: school.address,
            cover: school.cover_image_path,
            analysis: {
                prevention_level: school.school_analysis.prevention_level,
                emergency_response_level: school.school_analysis.emergency_response_level,
                recovery_level: school.school_analysis.recovery_level
            },
            created_at: school.created_at,
        });
        req.body = schools;
        next();
    } catch (err) {
        next(err);
    }
}

export const getSchool: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const school = await School.findOne({
            where: { uuid: id },
            relations: { school_analysis: true, reports: true, rooms: true },
        });

        if (!school) return next(createHttpError(404, `Report with id: ${id} does not exists`));

        req.body = school;
        next();
    } catch (err) {
        next(err);
    }
}