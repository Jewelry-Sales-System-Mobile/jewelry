import { wrapRequestHandler } from "./../utils/handlers";
import { Router } from "express";
import {
  addAddressController,
  changePassWordController,
  deleteAddressController,
  emailVerifyController,
  forgotPassWordController,
  getMyAddressController,
  getMyProfileController,
  getUserProfileController,
  loginController,
  logoutControler,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateAddressController,
  updateMyProfileController,
  verifyForgotPasswordController,
} from "~/controllers/users.controllers";
import { filterMiddleware } from "~/middlewares/common.middlewares";
import {
  accessTokenValidator,
  addAddressValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  forgotPassWordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateAddressValidator,
  updateProfileValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator,
} from "~/middlewares/users.middlewares";
import {
  UpdateAddressReqBody,
  UpdateProfileReqBody,
} from "~/models/requests/Users.requests";

const usersRouter = Router();

/**
 * @openapi
 * /users/register:
 *  post:
 *    description: Register a new user
 *    tags:
 *     - Users
 *    requestBody:
 *      description: Thong tin dang ky
 */
usersRouter.post(
  "/register",
  registerValidator,
  wrapRequestHandler(registerController)
);

/**
 * Description: Login a user
 * Route: [POST] /users/login
 * Body: { email: string, password: string }
 */
usersRouter.post("/login", loginValidator, wrapRequestHandler(loginController));

/**
 * Description: Logout a user
 * Route: [POST] /users/logout
 * Headers: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post(
  "/logout",
  accessTokenValidator,
  refreshTokenValidator,
  wrapRequestHandler(logoutControler)
);

/**
 * Description: verify email
 * Route: [POST] /users/verify-email
 * Body: { email_verify_token: string }
 */
usersRouter.post(
  "/verify-email",
  emailVerifyTokenValidator,
  wrapRequestHandler(emailVerifyController)
);

/**
 * Description. Verify email when user client click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post(
  "/resend-verify-email",
  accessTokenValidator,
  wrapRequestHandler(resendVerifyEmailController)
);

/**
 * Description: forgot password
 * Route: [POST] /users/forgot-password
 * Header: { Authorization: Bearer <access_token> }
 * Body: {email: string}
 */
usersRouter.post(
  "/forgot-password",
  forgotPassWordValidator,
  wrapRequestHandler(forgotPassWordController)
);

/**
 * Description: verify link in email forgot password
 * Route: [POST] /users/verify-fotgot-password
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post(
  "/verify-fotgot-password",
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
);

/**
 * Description: Reset Password
 * Route: [POST] /users/reset-password
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */
usersRouter.post(
  "/reset-password",
  resetPasswordValidator,
  wrapRequestHandler(resetPasswordController)
);

/**
 * Description: Change password
 * Route: [PUT] /users/change-password
 * Header: {Authorization: Bearer <access_token>}
 * Body: {old_password: string, password: string, confirm_password: string}
 */
usersRouter.put(
  "/change-password",
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePassWordController)
);

/**
 * Description: Get my profile
 * Route: [GET] /users/profile
 * Header: {Authorization: Bearer <access_token>}
 * Body: {}
 */
usersRouter.get(
  "/profile",
  accessTokenValidator,
  wrapRequestHandler(getMyProfileController)
);

/**
 * Description: Update my profile
 * Route: [PATCH] /users/profile
 * Header: {Authorization: Bearer <access_token>}
 * Body: UserSchema
 */
usersRouter.patch(
  "/profile",
  accessTokenValidator,
  verifiedUserValidator,
  updateProfileValidator,
  filterMiddleware<UpdateProfileReqBody>(["name", "date_of_birth", "username"]),
  wrapRequestHandler(updateMyProfileController)
);

/**
 * Description: Get user profile
 * Route: [GET] /users/profile/:user_id
 * Body: {}
 */
usersRouter.get(
  "/profile/:username",
  wrapRequestHandler(getUserProfileController)
);

/**
 * Description: Get user address by address_id
 * Route: [GET] /users/address
 * Header: {Authorization: Bearer <access_token>}
 * Body: {}
 */
usersRouter.get(
  "/address/:address_id",
  accessTokenValidator,
  wrapRequestHandler(getMyAddressController)
);

/**
 * Description: Add new address
 * Path: /address
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {address: string}
 */
usersRouter.post(
  "/address",
  accessTokenValidator,
  verifiedUserValidator,
  addAddressValidator,
  wrapRequestHandler(addAddressController)
);

/**
 * Description: Update address
 * Path: /address
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: {address: string}
 */
usersRouter.patch(
  "/address/:address_id",
  accessTokenValidator,
  verifiedUserValidator,
  updateAddressValidator,
  wrapRequestHandler(updateAddressController)
);

// /**
//  * Description: Delete address
//  * Path: /address/:address_id
//  * Method: DELETE
//  * Header: { Authorization: Bearer <access_token> }
//  * Body: {address: string}
//  */
usersRouter.delete(
  "/address/:address_id",
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(deleteAddressController)
);

export default usersRouter;
