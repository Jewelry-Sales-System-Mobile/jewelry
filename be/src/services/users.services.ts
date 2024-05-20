import User, { AddressType } from "~/models/schemas/User.schema";
import databaseService from "./database.services";
import {
  RegisterRequestBody,
  UpdateAddressReqBody,
  UpdateProfileReqBody,
} from "~/models/requests/Users.requests";
import { hashPassword } from "~/utils/crypto";
import { signToken } from "~/utils/jwt";
import { Role, TokenType, UserVerifyStatus } from "~/constants/enum";
import RefreshToken from "~/models/schemas/RefreshToken.schema";
import { ObjectId } from "mongodb";
import { USERS_MESSAGES } from "~/constants/messages";
import HTTP_STATUS from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Errors";

const projection = {
  password: 0,
  email_verify_token: 0,
  forgot_password_token: 0,
};

class UserService {
  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId();
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
    });
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: null,
        addresses: [],
        verify: UserVerifyStatus.Verified,
        password: hashPassword(payload.password),
        role: Role.User,
      })
    );

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Verified,
      role: Role.User,
    });
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    );
    return { access_token, refresh_token };
  }
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

  private signRefreshToken({
    user_id,
    verify,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
  }) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.RefreshToken,
        verify: verify,
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      },
      secret: process.env.JWT_SECRET_REFRESH_TOKEN as string,
    });
  }

  private signAccessAndRefreshToken({
    user_id,
    verify,
    role,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
    role: Role;
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify, role }),
      this.signRefreshToken({ user_id, verify }),
    ]);
  }

  private signEmailVerifyToken({
    user_id,
    verify,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
  }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN,
      },
      secret: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
    });
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
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify,
      role,
    });
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    );
    return { access_token, refresh_token };
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token });
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS,
    };
  }

  async verifyEmail(user_id: string) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token: "",
          verify: UserVerifyStatus.Verified,
          updated_at: "$$NOW",
        },
      },
    ]);
    return {
      message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    };
  }

  async resendEmailVerify({
    user_id,
    verify,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
  }) {
    //Giả vờ gửi email
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify,
    });
    console.log("Send email to user_id: ", email_verify_token);

    //Cập nhật lại email_verify_token
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token,
        },
        $currentDate: { updated_at: true },
      }
    );
    return {
      message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS,
    };
  }

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

  async addAddress(user_id: string, address: string, phoneNumber: string) {
    const newAddress: AddressType = {
      _id: new ObjectId(),
      address,
      phoneNumber,
    };
    const user = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $push: {
          addresses: newAddress,
        },
        $currentDate: { updated_at: true },
      }
    );
    return user;
  }

  async updateAddress(
    user_id: string,
    address_id: string,
    body: UpdateAddressReqBody
  ) {
    const updateFields: any = {};

    // Dynamically add fields to updateFields
    for (const key in body) {
      if (key !== "address_id" && body[key] !== undefined) {
        updateFields[`addresses.$.${key}`] = body[key];
      }
    }

    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id),
        "addresses._id": new ObjectId(address_id),
      },
      { $set: updateFields, $currentDate: { updated_at: true } },
      {
        returnDocument: "after",
        projection: projection,
      }
    );
    return user;
  }

  async deleteAddress(user_id: string, address_id: string) {
    const address = await databaseService.users.findOne({
      _id: new ObjectId(user_id),
      "addresses._id": new ObjectId(address_id),
    });

    if (address === null) {
      return { message: USERS_MESSAGES.ADDRESS_NOT_FOUND };
    }
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $pull: { addresses: { _id: new ObjectId(address_id) } } }
    );
    return {
      message: USERS_MESSAGES.DELETE_ADDRESS_SUCCESS,
    };
  }

  async getMyAddress(user_id: string, address_id: string) {
    const address = await databaseService.users.findOne({
      _id: new ObjectId(user_id),
      "addresses._id": new ObjectId(address_id),
    });

    if (address === null) {
      throw new ErrorWithStatus(
        USERS_MESSAGES.ADDRESS_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return address.addresses;
  }
}

const userService = new UserService();
export default userService;
