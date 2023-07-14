import { RequestHandler } from "express";
import { Area } from "../entities/area.entity";

export const postArea: RequestHandler = async (req, res, next) => {
    const { name } = req.body;

    try {
        const newArea = new Area();
        newArea.name = name;

        const area = await newArea.save();

        req.body = area;
        return next();
    } catch (err) {
        return next(err);
    }
}

export const getAreas: RequestHandler = async (req, res, next) => {
    try {
        const categories = await Area.find();
        req.body = categories;
        next();
    } catch (err) {
        next(err);
    }
};