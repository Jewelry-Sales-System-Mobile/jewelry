import User from "~/models/schemas/User.schema";
import databaseService from "./database.services";
import {
  RegisterRequestBody,
  UpdateAddressReqBody,
  UpdateProfileReqBody,
} from "~/models/requests/Users.requests";
import { hashPassword } from "~/utils/crypto";
import { signToken } from "~/utils/jwt";
import { Role, TokenType, UserVerifyStatus } from "~/constants/enum";
import { ObjectId } from "mongodb";
import { USERS_MESSAGES } from "~/constants/messages";
import HTTP_STATUS from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Errors";
import { get } from "lodash";
import { getBangkokTime } from "~/utils/handlers";

const projection = {
  password: 0,
  email_verify_token: 0,
  forgot_password_token: 0,
};

class UserService {
  private signAccessToken({
    user_id,
    verify,
    role,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
    role: Role;
  }) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.AccessToken,
        verify: verify,
        role,
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      },
      secret: process.env.JWT_SECRET_ACCESS_TOKEN as string,
    });
  }

  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId();

    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        password: hashPassword(payload.password),
        verify: UserVerifyStatus.Verified,
        role: Role.Staff,
        assigned_counter: "",
        created_at: getBangkokTime(),
        updated_at: getBangkokTime(),
      })
    );

    const access_token = await this.signAccessToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Verified,
      role: Role.Staff,
    });

    return { access_token };
  }

  private signForgotPassWordToken({
    user_id,
    verify,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
  }) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
      },
      secret: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
    });
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email });
    return Boolean(user);
  }
  async login({
    user_id,
    verify,
    role,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
    role: Role;
  }) {
    const access_token = await this.signAccessToken({
      user_id,
      verify,
      role,
    });

    return { access_token };
  }

  // async logout(refresh_token: string) {
  //   await databaseService.refreshTokens.deleteOne({ token: refresh_token });
  //   return {
  //     message: USERS_MESSAGES.LOGOUT_SUCCESS,
  //   };
  // }

  async forgotPassword({
    user_id,
    verify,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
  }) {
    const forgot_password_token = await this.signForgotPassWordToken({
      user_id,
      verify,
    });
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token,
        },
        $currentDate: { updated_at: true },
      }
    );
    console.log("forgot_password_token: ", forgot_password_token);
    return {
      message: "Check your email for reset password!!!",
    };
  }

  async resetPassword(user_id: string, new_password: string) {
    databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: "",
          password: hashPassword(new_password),
          verify: UserVerifyStatus.Verified,
        },
        $currentDate: { updated_at: true },
      }
    );

    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS,
    };
  }
  async changePassword(user_id: string, new_password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(new_password),
        },
        $currentDate: { updated_at: true },
      }
    );
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS,
    };
  }
  async getMyProfile(user_id: string) {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        projection: projection,
      }
    );
    return user;
  }
  async updateMyProfile(user_id: string, body: UpdateProfileReqBody) {
    const _body = body.date_of_birth
      ? { ...body, date_of_birth: new Date(body.date_of_birth) }
      : body;

    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_body as UpdateProfileReqBody & { date_of_birth?: Date }),
        },
        $currentDate: { updated_at: true },
      },
      {
        returnDocument: "after",
        projection: projection,
      }
    );
    return user;
  }
  async getUserProfile(username: string) {
    const user = await databaseService.users.findOne(
      {
        username,
      },
      {
        projection: { ...projection, created_at: 0, updated_at: 0, verify: 0 },
      }
    );
    if (user === null) {
      throw new ErrorWithStatus(
        USERS_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return user;
  }

  async activeUser(user_id: string) {
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          verify: UserVerifyStatus.Verified,
        },
        $currentDate: { updated_at: true },
      },
      {
        returnDocument: "after",
        projection: projection,
      }
    );
    return user;
  }

  async inactiveUser(user_id: string) {
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          verify: UserVerifyStatus.Unverified,
        },
        $currentDate: { updated_at: true },
      },
      {
        returnDocument: "after",
        projection: projection,
      }
    );
    return user;
  }
}

const userService = new UserService();
export default userService;
