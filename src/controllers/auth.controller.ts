import { RequestHandler } from "express";
import { hash, compare } from "../util/password";
import { encode } from "../util/token";
import createHttpError from "http-errors";
import { User } from "../entities/user.entity";
import { sendOTPMail } from "../util/mail";
import { generateOTP } from "../util/otp";

interface SignInBody {
  email: string;
  password: string;
}

export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ where: { email: email } });
    if (oldUser) return next(createHttpError(400, `User with email ${email} already exist.`));

    const hashedPassword = await hash(password);
    const otp = generateOTP();

    const newUser = User.create({
      name: name,
      email: email,
      password: hashedPassword,
      otp: otp,
    });

    const user = await newUser.save();
    if (!user) return next(createHttpError(400, 'Failed to create account'));
    await sendOTPMail(email, name, otp);

    req.body = { message: 'Please check your email to verify your account' }
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyUserEmail: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return next(createHttpError(401, `User with email ${email} does not exists`));
    }

    if (user.otp != otp) {
      return next(createHttpError(401, 'Invalid OTP'));
    }

    user.otp = null;
    user.is_active = true;
    const updatedUser = await user.save();

    if (!updatedUser) {
      return next(createHttpError(400, 'Failed to verify email, try again later'));
    }

    req.body = {
      message: 'Email verification success, please login to continue.'
    };
    return next();
  } catch (error) {
    return next(error);
  }
}

export const signInWithToken: RequestHandler = async (req, res, next) => {
  // return next(createHttpError(500, 'User not found'));
  try {
    const user = await User.findOne({
      where: { id: req.body.user_id }
    });

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    if (!user.is_active) {
      return next(createHttpError(400, `You need to verify your email before you login.`));
    }

    req.body = {
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin,
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
      select: { password: true, id: true, name: true, email: true, is_admin: true, is_active: true, avatar_path: true }
    });

    if (!user) {
      return next(createHttpError(401, `User with email ${signInBody.email.trim()} does not exists`));
    }

    if (!user.is_active) {
      req.body = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        avatar: user.avatar_path,
        is_active: user.is_active
      };
      next();
    }

    if (await compare(signInBody.password, user.password)) {
      const token = encode(user.id);

      req.body = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        avatar: user.avatar_path,
        access_token: token,
        is_active: user.is_active
      }
      next();
    } else {
      next(createHttpError(401, "Email or password you've entered is incorrect"));
    }
  } catch (error) {
    next(error);
  }
};