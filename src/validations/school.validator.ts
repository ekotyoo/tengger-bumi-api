import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import validationHandler from "../middlewares/validator.middleware";

export const schoolValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        school_name: Joi.string().required(),
        school_address: Joi.string().required(),
        floor_plan: Joi.any().required(),
    });

    validationHandler(req, res, next, schema);
};