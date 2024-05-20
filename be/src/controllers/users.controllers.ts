import { ParamsDictionary } from "express-serve-static-core";
import { NextFunction, Request, Response } from "express";
import core from "express-serve-static-core";
import { ObjectId } from "mongodb";
import { UserVerifyStatus } from "~/constants/enum";
import HTTP_STATUS from "~/constants/httpStatus";
import { USERS_MESSAGES } from "~/constants/messages";
import {
  AddAddressReqBody,
  ChangePasswordReqBody,
  DeleteAddressReqParams,
  EmailVerifyRequestBody,
  ForgotPassWordRequestBody,
  GetAddressReqParams,
  GetProfileReqParams,
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  ResetPasswordReqBody,
  TokenPayload,
  UpdateAddressReqBody,
  UpdateAddressReqParams,
  UpdateProfileReqBody,
  VerifyForgotPassWordTokenRequestBody,
} from "~/models/requests/Users.requests";
import User from "~/models/schemas/User.schema";
import databaseService from "~/services/database.services";
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

export const logoutControler = async (
  req: Request<core.ParamsDictionary, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body;
  const result = await userService.logout(refresh_token);
  return res.json({ data: result });
};

export const emailVerifyController = async (
  req: Request<core.ParamsDictionary, any, EmailVerifyRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload;
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id),
  });
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND,
    });
  }

  //Đã verify thì mình sẽ không báo lỗi mà sẽ trả status OK với message là đã verify rồi
  if (user.email_verify_token === "") {
    res.json({
      message: USERS_MESSAGES.EMAIL_IS_VERIFIED_BEFORE,
    });
  }

  const result = await userService.verifyEmail(user_id);
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    data: result,
  });
};

export const resendVerifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id, verify } = req.decoded_authorization as TokenPayload;
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id),
  });
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND,
    });
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_IS_VERIFIED_BEFORE,
    });
  }
  const result = await userService.resendEmailVerify({
    user_id: user_id.toString(),
    verify,
  });
  return res.json(result);
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

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload;
  const { password } = req.body;
  const result = await userService.resetPassword(user_id, password);
  return res.json(result);
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

export const getMyAddressController = async (
  req: Request<GetAddressReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { address_id } = req.params;
  const address = await userService.getMyAddress(user_id, address_id);
  return res.json({
    message: USERS_MESSAGES.GET_MY_ADDRESS_SUCCESS,
    data: address,
  });
};

export const addAddressController = async (
  req: Request<ParamsDictionary, any, AddAddressReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { address, phoneNumber } = req.body;
  const result = await userService.addAddress(user_id, address, phoneNumber);
  return res.json({
    message: USERS_MESSAGES.ADD_ADDRESS_SUCCESS,
    data: result,
  });
};

export const updateAddressController = async (
  req: Request<UpdateAddressReqParams, any, UpdateAddressReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { address_id } = req.params;
  const body = req.body;

  const result = await userService.updateAddress(user_id, address_id, body);
  return res.json({
    message: USERS_MESSAGES.UPDATE_ADDRESS_SUCCESS,
    data: result,
  });
};

export const deleteAddressController = async (
  req: Request<DeleteAddressReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { address_id } = req.params;
  const result = await userService.deleteAddress(user_id, address_id);
  return res.json(result);
};
