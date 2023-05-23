import { RequestHandler } from "express";
import { Category } from "../entities/category.entity";
import { ReportType } from "../entities/ReportType.entity";

export const postCategory: RequestHandler = async (req, res, next) => {
    const { name, type } = req.body;
    console.log(req.body);

    try {
        const newCategory = new Category();
        newCategory.name = name;
        newCategory.type = type as ReportType;

        const category = await newCategory.save();

        req.body = category;
        return next();
    } catch (err) {
        return next(err);
    }
}

export const getCategories: RequestHandler = async (req, res, next) => {
    const query = req.query.type ?? '';

    try {
        const data = await Category.find({ where: { type: query as ReportType } });
        const categories = data.map((category) => <unknown>{
            id: category.id,
            name: category.name,
            type: category.type
        });
        req.body = categories;
        next();
    } catch (err) {
        next(err);
    }
};