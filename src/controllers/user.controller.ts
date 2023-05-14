import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { User } from "../entities/user.entity";

export const getUser: RequestHandler = async (req, res, next) => {
    const id = req.params.id;

    try {
        const user = await User.findOneBy({ uuid: id });

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

export const updateUser: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;
    const avatar = req.file as Express.Multer.File;

    try {
        const user = await User.findOneBy({ uuid: id });

        if (!user) {
            next(createHttpError(404, `User with id ${id} does not exists`));
            return;
        }

        if (name) user.name = name;
        if (avatar) user.avatar_path = avatar.path.replace(/\\/g, '/');

        const updatedUser = await user.save();
        req.body = updatedUser;
        next();
    } catch (err) {
        next(err);
    }
}