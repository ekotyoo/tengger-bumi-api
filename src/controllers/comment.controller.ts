import { RequestHandler } from "express";
import { User } from "../entities/user.entity";
import { Report } from "../entities/report.entity";
import { Comment } from "../entities/comment.entity";

export const postComment: RequestHandler = async (req, res, next) => {
    const { comment, report_id, user_id } = req.body;

    try {
        const author = await User.findOneByOrFail({ uuid: user_id });
        const report = await Report.findOneByOrFail({ uuid: report_id });

        const newComment = new Comment();
        newComment.author = author;
        newComment.report = report;
        newComment.comment = comment;

        const commentResult = await newComment.save();
        req.body = {
            id: commentResult.uuid,
            comment: commentResult.comment,
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

export const getComments: RequestHandler = async (req, res, next) => {
    try {
        const reportId = req.body.report_id;
        const data = await Comment.find({
            where: { report: { uuid: reportId } },
            relations: { author: true },
            order: { created_at: "DESC" }
        });

        const comments = data.map((comment) => <unknown>{
            id: comment.uuid,
            comment: comment.comment,
            created_at: comment.created_at,
            author: {
                id: comment.author.uuid,
                name: comment.author.name,
                avatar: comment.author.avatar_path
            }
        });

        req.body = comments;
        return next();
    } catch (err) {
        return next(err);
    }
};