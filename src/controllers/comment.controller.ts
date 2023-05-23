import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { User } from "../entities/user.entity";
import { Report } from "../entities/report.entity";
import { Comment } from "../entities/comment.entity";

export const postComment: RequestHandler = async (req, res, next) => {
    try {
        const { comment, report_id } = req.body;
        const user_id = req.user_id;

        const author = await User.findOneByOrFail({ uuid: user_id });
        const report = await Report.findOneByOrFail({ uuid: report_id });

        const newComment = new Comment();
        newComment.author = author;
        newComment.report = report;
        newComment.comment = comment;

        const commentResult = await newComment.save();
        const allowEdit = commentResult.author.uuid == user_id;
        req.body = {
            id: commentResult.uuid,
            comment: commentResult.comment,
            allow_edit: allowEdit,
            created_at: commentResult.created_at,
            author: {
                id: commentResult.author.uuid,
                name: commentResult.author.name,
                avatar: commentResult.author.avatar_path
            }
        };

        next();
    } catch (err) {
        next(err);
    }
};

export const deleteComment: RequestHandler = async (req, res, next) => {
    try {
        const report_id = req.params.report_id;
        const comment_id = req.params.comment_id;

        const comment = await Comment.findOneBy({ uuid: comment_id, report: { uuid: report_id } });
        const result = await comment?.remove();

        if (!result) return next(createHttpError(404, `Comment with id: "${comment_id}" does not exists`));

        next();
    } catch (err) {
        next(err);
    }
}

export const getComments: RequestHandler = async (req, res, next) => {
    try {
        const reportId = req.body.report_id;
        const user_id = req.user_id;
        const data = await Comment.find({
            where: { report: { uuid: reportId } },
            relations: { author: true },
            order: { created_at: "DESC" }
        });

        const comments = data.map((comment) => {
            const allowEdit = comment.author.uuid == user_id;
            return <unknown>{
                id: comment.uuid,
                comment: comment.comment,
                created_at: comment.created_at,
                allow_edit: allowEdit,
                author: {
                    id: comment.author.uuid,
                    name: comment.author.name,
                    avatar: comment.author.avatar_path
                }
            };
        });

        req.body = comments;
        return next();
    } catch (err) {
        return next(err);
    }
};