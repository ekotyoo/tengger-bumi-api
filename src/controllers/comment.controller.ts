import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { User } from "../entities/user.entity";
import { Report } from "../entities/report.entity";
import { Comment } from "../entities/comment.entity";

export const postComment: RequestHandler = async (req, res, next) => {
    try {
        const { comment, report_id } = req.body;
        const user_id = req.user_id;

        const author = await User.findOneByOrFail({ id: user_id });
        const report = await Report.findOneByOrFail({ id: report_id });

        const newComment = new Comment();
        newComment.author = author;
        newComment.report = report;
        newComment.comment = comment;

        const commentResult = await newComment.save();
        const allowEdit = commentResult.author.id == user_id;
        req.body = {
            id: commentResult.id,
            comment: commentResult.comment,
            allow_edit: allowEdit,
            created_at: commentResult.created_at,
            author: {
                id: commentResult.author.id,
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
        const report_id = Number(req.params.report_id);
        const comment_id = Number(req.params.comment_id);

        const comment = await Comment.findOneBy({ id: comment_id, report: { id: report_id } });
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
            where: { report: { id: reportId } },
            relations: { author: true },
            order: { created_at: "DESC" }
        });

        const comments = data.map((comment) => {
            const allowEdit = comment.author.id == user_id;
            return <unknown>{
                id: comment.id,
                comment: comment.comment,
                created_at: comment.created_at,
                allow_edit: allowEdit,
                author: {
                    id: comment.author.id,
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