import { changePasswordValidator } from "./../middlewares/users.middlewares";
import { wrapRequestHandler } from "./../utils/handlers";
import { Router } from "express";
import {
  activeUserController,
  changePassWordController,
  getAllUsersController,
  getMyProfileController,
  getUserByIdController,
  getUserProfileController,
  inactiveUserController,
  loginController,
  registerController,
  setToManagerController,
  setToStaffController,
  updateNameOfUserController,
} from "~/controllers/users.controllers";
import {
  accessTokenValidator,
  loginValidator,
  registerValidator,
} from "~/middlewares/users.middlewares";

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
 * Description: Change password
 * Route: [PUT] /users/change-password
 * Header: {Authorization: Bearer <access_token>}
 * Body: {old_password: string, password: string, confirm_password: string}
 */
usersRouter.put(
  "/change-password",
  accessTokenValidator,
  changePasswordValidator,
  wrapRequestHandler(changePassWordController)
);

/**
 * Description: Active User
 * Route: [PUT] /users/:user_id/active
 */
usersRouter.put(
  "/:user_id/active",
  accessTokenValidator,
  wrapRequestHandler(activeUserController)
);

/**
 * Description: Inactive User
 * Route: [PUT] /users/:user_id/active
 */
usersRouter.put(
  "/:user_id/inactive",
  accessTokenValidator,
  wrapRequestHandler(inactiveUserController)
);

/**
 * Description: Get All Users
 * Route: [GET] /users/get-all
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.get(
  "/get-all",
  accessTokenValidator,
  wrapRequestHandler(getAllUsersController)
);

/**
 * Description: Update name of a user
 * Route: [PUT] /users/update/:user_id
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.put(
  "/update/:user_id",
  accessTokenValidator,
  wrapRequestHandler(updateNameOfUserController)
);

/**
 * Description: Get user by id
 * Route: [GET] /users/:user_id
 * Body: {}
 */
usersRouter.get("/:user_id", wrapRequestHandler(getUserByIdController));

/**
 * Description: Get my profile
 * Route: [GET] /users/profile
 * Header: {Authorization: Bearer <access_token>}
 * Body: {}
 */
usersRouter.get(
  "/profile/my-profile",
  accessTokenValidator,
  wrapRequestHandler(getMyProfileController)
);

/**
 * Description: Set to Manager
 * Route: [PUT] /users/:user_id/set-to-manager
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.put(
  "/:user_id/set-to-manager",
  accessTokenValidator,
  wrapRequestHandler(setToManagerController)
);

/**
 * Description: Set To Staff
 * Route: [PUT] /users/:user_id/set-to-staff
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.put(
  "/:user_id/set-to-staff",
  accessTokenValidator,
  wrapRequestHandler(setToStaffController)
);

// /**
//  * Description: verify email
//  * Route: [POST] /users/verify-email
//  * Body: { email_verify_token: string }
//  */
// usersRouter.post(
//   "/verify-email",
//   emailVerifyTokenValidator,
//   wrapRequestHandler(emailVerifyController)
// );

// /**
//  * Description. Verify email when user client click on the link in email
//  * Path: /resend-verify-email
//  * Method: POST
//  * Header: { Authorization: Bearer <access_token> }
//  * Body: {}
//  */
// usersRouter.post(
//   "/resend-verify-email",
//   accessTokenValidator,
//   wrapRequestHandler(resendVerifyEmailController)
// );

// /**
//  * Description: forgot password
//  * Route: [POST] /users/forgot-password
//  * Header: { Authorization: Bearer <access_token> }
//  * Body: {email: string}
//  */
// usersRouter.post(
//   "/forgot-password",
//   forgotPassWordValidator,
//   wrapRequestHandler(forgotPassWordController)
// );

// /**
//  * Description: verify link in email forgot password
//  * Route: [POST] /users/verify-fotgot-password
//  * Header: { Authorization: Bearer <access_token> }
//  * Body: {}
//  */
// usersRouter.post(
//   "/verify-fotgot-password",
//   verifyForgotPasswordTokenValidator,
//   wrapRequestHandler(verifyForgotPasswordController)
// );

// /**
//  * Description: Reset Password
//  * Route: [POST] /users/reset-password
//  * Body: {forgot_password_token: string, password: string, confirm_password: string}
//  */
// usersRouter.post(
//   "/reset-password",
//   resetPasswordValidator,
//   wrapRequestHandler(resetPasswordController)
// );

// /**
//  * Description: Update my profile
//  * Route: [PATCH] /users/profile
//  * Header: {Authorization: Bearer <access_token>}
//  * Body: UserSchema
//  */
// usersRouter.patch(
//   "/profile",
//   accessTokenValidator,
//   verifiedUserValidator,
//   updateProfileValidator,
//   filterMiddleware<UpdateProfileReqBody>(["name", "date_of_birth", "username"]),
//   wrapRequestHandler(updateMyProfileController)
// );

// /**
//  * Description: Get user address by address_id
//  * Route: [GET] /users/address
//  * Header: {Authorization: Bearer <access_token>}
//  * Body: {}
//  */
// usersRouter.get(
//   "/address/:address_id",
//   accessTokenValidator,
//   wrapRequestHandler(getMyAddressController)
// );

// /**
//  * Description: Add new address
//  * Path: /address
//  * Method: POST
//  * Header: { Authorization: Bearer <access_token> }
//  * Body: {address: string}
//  */
// usersRouter.post(
//   "/address",
//   accessTokenValidator,
//   verifiedUserValidator,
//   addAddressValidator,
//   wrapRequestHandler(addAddressController)
// );

// /**
//  * Description: Update address
//  * Path: /address
//  * Method: PATCH
//  * Header: { Authorization: Bearer <access_token> }
//  * Body: {address: string}
//  */
// usersRouter.patch(
//   "/address/:address_id",
//   accessTokenValidator,
//   verifiedUserValidator,
//   updateAddressValidator,
//   wrapRequestHandler(updateAddressController)
// );

// // /**
// //  * Description: Delete address
// //  * Path: /address/:address_id
// //  * Method: DELETE
// //  * Header: { Authorization: Bearer <access_token> }
// //  * Body: {address: string}
// //  */
// usersRouter.delete(
//   "/address/:address_id",
//   accessTokenValidator,
//   verifiedUserValidator,
//   wrapRequestHandler(deleteAddressController)
// );

export default usersRouter;
