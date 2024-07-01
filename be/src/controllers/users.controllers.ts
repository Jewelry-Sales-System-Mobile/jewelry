import { ParamsDictionary } from "express-serve-static-core";
import { NextFunction, Request, Response } from "express";
import core from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { UserVerifyStatus } from "~/constants/enum";
import HTTP_STATUS from "~/constants/httpStatus";
import { USERS_MESSAGES } from "~/constants/messages";
import {
  ChangePasswordReqBody,
  ForgotPassWordRequestBody,
  GetProfileReqParams,
  LoginRequestBody,
  RegisterRequestBody,
  ResetPasswordReqBody,
  TokenPayload,
  UpdateProfileReqBody,
  VerifyForgotPassWordTokenRequestBody,
} from "~/models/requests/Users.requests";
import User from "~/models/schemas/User.schema";
import userService from "~/services/users.services";

export const registerController = async (
  req: Request<core.ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body);
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result,
  });
};

export const loginController = async (
  req: Request<core.ParamsDictionary, any, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User;
  const user_id = user._id as ObjectId;
  const result = await userService.login({
    user_id: user_id.toString(),
    verify: user.verify,
    role: user.role,
  });
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data: result,
  });
};

export const forgotPassWordController = async (
  req: Request<core.ParamsDictionary, any, ForgotPassWordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User;
  const result = await userService.forgotPassword({
    user_id: (_id as ObjectId).toString(),
    verify,
  });
  return res.json(result);
};

export const verifyForgotPasswordController = async (
  req: Request<
    core.ParamsDictionary,
    any,
    VerifyForgotPassWordTokenRequestBody
  >,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USERS_MESSAGES.FORGOT_PASSWORD_VERIFY_SUCCESS,
  });
};

export const changePassWordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { password } = req.body;
  const result = await userService.changePassword(user_id, password);
  return res.json({ data: result });
};

export const getMyProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const user = await userService.getMyProfile(user_id);
  return res.json({
    message: USERS_MESSAGES.GET_MY_PROFILE_SUCCESS,
    data: user,
  });
};

export const updateMyProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const body = req.body;
  const user = await userService.updateMyProfile(user_id, body);
  return res.json({
    message: USERS_MESSAGES.UPDATE_PROFILE_SUCCESS,
    data: user,
  });
};

export const getUserProfileController = async (
  req: Request<GetProfileReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const user = await userService.getUserProfile(username);
  return res.json({
    message: USERS_MESSAGES.GET_USER_PROFILE_SUCCESS,
    data: user,
  });
};
