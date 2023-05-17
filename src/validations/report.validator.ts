import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import validationHandler from "../middlewares/validator.middleware";

export const reportValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        description: Joi.string().required(),
        is_active: Joi.boolean(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        category_id: Joi.string().required(),
        school_id: Joi.string().required(),
        room_id: Joi.string().required(),
        additional_infos: Joi.array().items({
            label: Joi.string().required(),
            information: Joi.string().required()
        })
    });

    validationHandler(req, res, next, schema);
};