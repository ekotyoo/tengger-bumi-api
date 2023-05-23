import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import validationHandler from "../middlewares/validator.middleware";


export const commentValidator = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        comment: Joi.string().required(),
        report_id: Joi.number().required(),
    }).options({ allowUnknown: true });

    validationHandler(req, res, next, schema);
};