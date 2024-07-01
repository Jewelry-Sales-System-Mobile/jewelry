import { hashPassword } from "~/utils/crypto";
import { validate } from "./../utils/validation";
import { checkSchema, ParamSchema } from "express-validator";
import { USERS_MESSAGES } from "~/constants/messages";
import databaseService from "~/services/database.services";
import userService from "~/services/users.services";
import { verifyToken } from "~/utils/jwt";
import { ErrorWithStatus } from "~/models/Errors";
import HTTP_STATUS from "~/constants/httpStatus";
import { JsonWebTokenError } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { REGEX_PHONENUMBER_VN, REGEX_USERNAME } from "~/constants/regex";
import { TokenPayload } from "~/models/requests/Users.requests";
import { Role, UserVerifyStatus } from "~/constants/enum";

const passwordSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING,
  },
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED,
  },
  isLength: {
    options: {
      min: 6,
      max: 50,
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH,
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,
  },
};
const confirmPassWordSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING,
  },
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
  },
  isLength: {
    options: {
      min: 6,
      max: 50,
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH,
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG,
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH);
      }
      return true;
    },
  },
};
const forgotPassWordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus(
          USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secret: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
        });
        const { user_id } = decoded_forgot_password_token;
        const user = await databaseService.users.findOne({
          _id: new ObjectId(user_id),
        });

        if (user === null) {
          throw new ErrorWithStatus(
            USERS_MESSAGES.USER_NOT_FOUND,
            HTTP_STATUS.UNAUTHORIZED
          );
        }

        req.decoded_forgot_password_token = decoded_forgot_password_token;
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus(
            USERS_MESSAGES.REFRESH_TOKEN_INVALID,
            HTTP_STATUS.UNAUTHORIZED
          );
        }
        throw error;
      }
      return true;
    },
  },
};
const nameSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING,
  },
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED,
  },
  isLength: {
    options: {
      min: 1,
      max: 100,
    },
    errorMessage: USERS_MESSAGES.NAME_LENGTH,
  },
  trim: true,
};
const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true,
    },
    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8061,
  },
};
const imageUrlSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.IMAGE_URL_MUST_BE_STRING,
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 400,
    },
    errorMessage: USERS_MESSAGES.IMAGE_URL_LENGTH,
  },
};

const emailSchema: ParamSchema = {
  isEmail: {
    errorMessage: USERS_MESSAGES.EMAIL_INVALID,
  },
  notEmpty: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED,
  },
  trim: true,
};
const addressSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGES.LOCATION_MUST_BE_STRING,
  },
  isLength: {
    options: {
      min: 1,
      max: 200,
    },
    errorMessage: USERS_MESSAGES.LOCATION_LENGTH,
  },
  trim: true,
};
const phoneNumberSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGES.PHONENUMBER_MUST_BE_STRING,
  },
  trim: true,
  custom: {
    options: async (value, { req }) => {
      if (!REGEX_PHONENUMBER_VN.test(value)) {
        throw new Error(USERS_MESSAGES.PHONENUMBER_INVALID);
      }
    },
  },
};

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password),
            });
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT);
            }
            req.user = user;
            return true;
          },
        },
      },
      password: passwordSchema,
    },
    ["body"]
  )
);

export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      email: {
        ...emailSchema,
        custom: {
          options: async (value) => {
            const isExist = await userService.checkEmailExist(value);
            if (isExist) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
            }
            return true;
          },
        },
      },
      password: passwordSchema,
      confirm_password: confirmPassWordSchema,
    },
    ["body"]
  )
);

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const access_token = (value || "").split(" ")[1];
            if (!access_token) {
              throw new ErrorWithStatus(
                USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                HTTP_STATUS.UNAUTHORIZED
              );
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secret: process.env.JWT_SECRET_ACCESS_TOKEN as string,
              });
              (req as Request).decoded_authorization = decoded_authorization;
            } catch (error) {
              throw new ErrorWithStatus(
                (error as JsonWebTokenError).message,
                HTTP_STATUS.UNAUTHORIZED
              );
            }

            return true;
          },
        },
      },
    },
    ["headers"]
  )
);

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        ...passwordSchema,
        custom: {
          options: async (value, { req }) => {
            const { user_id } = req.decoded_authorization as TokenPayload;
            const user = await databaseService.users.findOne({
              _id: new ObjectId(user_id),
            });
            if (!user) {
              throw new ErrorWithStatus(
                USERS_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
              );
            }
            const { password } = user;
            const isMatch = hashPassword(value) === password;
            if (!isMatch) {
              throw new ErrorWithStatus(
                USERS_MESSAGES.OLD_PASSWORD_INCORRECT,
                HTTP_STATUS.UNAUTHORIZED
              );
            }
          },
        },
      },
      password: passwordSchema,
      confirm_password: confirmPassWordSchema,
    },
    ["body"]
  )
);

export const updateProfileValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        notEmpty: undefined,
        optional: true,
      },
      date_of_birth: {
        ...dateOfBirthSchema,
        optional: true,
      },

      username: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.USERNAME_MUST_BE_STRING,
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!REGEX_USERNAME.test(value)) {
              throw new Error(USERS_MESSAGES.USERNAME_INVALID);
            }
            const user = await databaseService.users.findOne({
              username: value,
            });
            if (user) {
              throw new Error(USERS_MESSAGES.USERNAME_EXISTED);
            }
          },
        },
      },
      avatar: imageUrlSchema,
    },
    ["body"]
  )
);
