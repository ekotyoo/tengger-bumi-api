import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import validationHandler from "../middlewares/validator.middleware";

export const reportValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        category_id: Joi.string().required(),
        planting_date: Joi.date().required(),
        planting_count: Joi.number().required(),
        area_id: Joi.string().required(),
    }).options({ allowUnknown: true });

    validationHandler(req, res, next, schema);
};