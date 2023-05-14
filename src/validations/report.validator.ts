import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import validationHandler from "../middlewares/validator.middleware";

export const reportValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        description: Joi.string().required(),
        is_active: Joi.boolean().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        category: Joi.string().valid('low', 'medium', 'high').required()
    });

    validationHandler(req, res, next, schema);
};