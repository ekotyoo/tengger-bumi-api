import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { User } from "../entities/user.entity";

export const getUser: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);

    try {
        const user = await User.findOneBy({ id: id });

        if (!user) {
            next(createHttpError(404, `User with id ${id} does not exists`));
            return;
        }

        req.body = user;
        next();
    } catch (err) {
        next(err);
    }
}

export const getUserStats: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);

    try {
        const user = await User.findOneOrFail({ where: { id: id }, relations: { plants: { category: true } } });
        const grouppedByCategories = groupBy(user.plants, (p) => p.category.name);
        const keys = Object.keys(grouppedByCategories);

        const result = keys.map((val) => {
            const count = grouppedByCategories[val].length;
            const category = grouppedByCategories[val][0].category;
            return {
                ...category,
                count: count
            };
        });
        req.body = result;

        next();
    } catch (err) {
        next(err);
    }
}

function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        const group = prev[groupKey] || [];
        group.push(curr);
        return { ...prev, [groupKey]: group };
    }, {});
}

export const updateUser: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);
    const { name, delete_old } = req.body;
    const avatar = req.file as Express.Multer.File;

    console.log("Delete old", delete_old);

    try {
        const user = await User.findOneBy({ id: id });

        if (!user) {
            next(createHttpError(404, `User with id ${id} does not exists`));
            return;
        }

        if (name) user.name = name;
        if (avatar) {
            const newPath = avatar.path.replace(/\\/g, '/');
            user.avatar_path = newPath;
        }
        if (delete_old == true || delete_old == "true") {
            user.avatar_path = null;
        }

        const updatedUser = await user.save();
        req.body = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            is_admin: updatedUser.is_admin,
            avatar: updatedUser.avatar_path,
        };
        next();
    } catch (err) {
        next(err);
    }
}