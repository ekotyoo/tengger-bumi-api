import { RequestHandler } from "express";
import { Category } from "../entities/category.entity";

export const postCategory: RequestHandler = async (req, res, next) => {
    const { name } = req.body;
    console.log(req.body);

    try {
        const newCategory = new Category();
        newCategory.name = name;

        const category = await newCategory.save();

        req.body = category;
        return next();
    } catch (err) {
        return next(err);
    }
}

export const getCategories: RequestHandler = async (req, res, next) => {
    try {
        const categories = await Category.find();
        req.body = categories;
        next();
    } catch (err) {
        next(err);
    }
};