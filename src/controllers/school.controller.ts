import { RequestHandler } from "express";
import { School } from "../entities/school.entity";
import { Room } from "../entities/room.entity";
import { Position } from "../entities/position.entity";
import { SchoolAnalysis } from "../entities/school_analysis.entity";

interface RoomBody {
    label: string
    color: string
    polygon: Position[]
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