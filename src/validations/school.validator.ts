import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import validationHandler from "../middlewares/validator.middleware";

export const schoolValidator = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    const schema = Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        floor_plan: Joi.any().required(),
        centroid: Joi.object({
            latitude: Joi.number(),
            longitude: Joi.number()
        }).required(),
    });

    validationHandler(req, res, next, schema);
};