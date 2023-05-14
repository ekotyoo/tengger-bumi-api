import { RequestHandler } from "express";
import { hash, compare } from "../util/password";
import { encode } from "../util/token";
import createHttpError from "http-errors";
import { User } from "../entities/user.entity";

export const signUp: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await hash(password);

  try {
    const newUser = User.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = encode(user.uuid);

    req.body = { token: token }
    next();
  } catch (error) {
    next(error);
  }
};

interface SignInBody {
  email: string;
  password: string;
}

export const signInWithToken: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.body.user_id }
    });

    if (!user) {
      next(createHttpError(401, 'User not found'));
      return;
    }

    req.body = {
      id: user.uuid,
      name: user.name,
      email: user.email,
      is_admin: user.isAdmin,
      avatar: user.avatar_path,
    };
    next();
  } catch (error) {
    next(error);
  }
}

export const signIn: RequestHandler = async (req, res, next) => {
  const signInBody: SignInBody = req.body;

  try {
    const user = await User.findOne({
      where: { email: signInBody.email },
      select: { password: true, uuid: true, name: true, email: true, isAdmin: true, avatar_path: true }
    });

    if (!user) {
      next(createHttpError(401, `User with email ${signInBody.email.trim()} does not exists`));
      return;
    }

    if (await compare(signInBody.password, user.password)) {
      const token = encode(user.uuid);

      req.body = {
        id: user.uuid,
        name: user.name,
        email: user.email,
        is_admin: user.isAdmin,
        avatar: user.avatar_path,
        access_token: token,
      }
      next();
    } else {
      next(createHttpError(401, "Email or password you've entered is incorrect"));
    }
  } catch (error) {
    next(error);
  }
};