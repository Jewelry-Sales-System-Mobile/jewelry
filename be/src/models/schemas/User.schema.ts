import { ObjectId } from "mongodb";
import { Role, UserVerifyStatus } from "~/constants/enum";

export interface AddressType {
  _id?: ObjectId;
  address: string;
  phoneNumber: string;
}

interface UserType {
  _id?: ObjectId;
  name: string;
  email: string;
  date_of_birth: Date | null;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  email_verify_token?: string; // jwt hoặc '' nếu đã xác thực email
  forgot_password_token?: string; // jwt hoặc '' nếu đã xác thực email
  verify?: UserVerifyStatus;
  addresses?: AddressType[]; // optional
  username?: string; // optional
  avatar?: string; // optional
  role?: Role;
}

export default class User {
  _id?: ObjectId;
  name: string;
  email: string;
  date_of_birth: Date | null;
  password: string;
  created_at: Date;
  updated_at: Date;
  email_verify_token: string;
  forgot_password_token: string;
  verify: UserVerifyStatus;
  addresses: AddressType[];
  username: string;
  avatar: string;
  role: Role;

  constructor(user: UserType) {
    const date = new Date();
    this._id = user._id;
    this.name = user.name || "";
    this.email = user.email;
    this.date_of_birth = user.date_of_birth || null;
    this.password = user.password;
    this.created_at = user.created_at || date;
    this.updated_at = user.updated_at || date;
    this.email_verify_token = user.email_verify_token || "";
    this.forgot_password_token = user.forgot_password_token || "";
    this.verify = user.verify || UserVerifyStatus.Unverified;
    this.addresses = user.addresses || [];
    this.username = user.username || "";
    this.avatar = user.avatar || "";
    this.role = user.role || Role.User;
  }
}
