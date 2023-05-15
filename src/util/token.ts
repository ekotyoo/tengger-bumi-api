import jwt from "jsonwebtoken";
import env from "./env"

export const encode = (id: string) => jwt.sign({ id }, env.JWT_SECRET_KEY, { expiresIn: '1h' });

export const decode = (token: string) => {
    try {
        return jwt.verify(token, env.JWT_SECRET_KEY);
    } catch (err) {
        console.error(err);
    }
};