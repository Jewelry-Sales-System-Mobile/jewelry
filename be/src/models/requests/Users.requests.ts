import { JwtPayload } from "jsonwebtoken";
import { ParamsDictionary } from "express-serve-static-core";
import { extend } from "lodash";
import { TokenType } from "~/constants/enum";

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
}

export interface LogoutRequestBody {
  refresh_token: string;
}

export interface ForgotPassWordRequestBody {
  email: string;
}

export interface VerifyForgotPassWordTokenRequestBody {
  forgot_password_token: string;
}

export interface ResetPasswordReqBody {
  password: string;
  confirm_password: string;
  forgot_password_token: string;
}

export interface UpdateProfileReqBody {
  name?: string;
  date_of_birth?: string;
  username?: string;
}

export interface GetProfileReqParams {
  username: string;
}

// export interface FollowReqBody {
//   follow_user_id: string;
// }

// export interface UnFollowReqParams extends ParamsDictionary {
//   follow_user_id: string;
// }

export interface ChangePasswordReqBody {
  old_password: string;
  password: string;
  confirm_password: string;
}

export interface GetAddressReqParams extends ParamsDictionary {
  address_id: string;
}

export interface AddAddressReqBody {
  address: string;
  phoneNumber: string;
}

export interface UpdateAddressReqBody {
  [key: string]: any;
  address_id: string;
  address?: string;
  phoneNumber?: string;
}

export interface UpdateAddressReqParams extends ParamsDictionary {
  address_id: string;
}

export interface DeleteAddressReqParams extends ParamsDictionary {
  address_id: string;
}
