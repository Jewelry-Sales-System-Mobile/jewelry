import { ObjectId } from "mongodb";
import { Role, UserVerifyStatus } from "~/constants/enum";

interface UserType {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role; // manager, staff
  assigned_counter: ObjectId | string; // reference to Counters collection
  verify: UserVerifyStatus;
  created_at?: Date;
  updated_at?: Date;
}

export default class User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role; // manager, staff
  assigned_counter: ObjectId | string; // reference to Counters collection
  verify: UserVerifyStatus;
  created_at?: Date;
  updated_at?: Date;

  constructor(user: UserType) {
    const date = new Date();
    this._id = user._id || new ObjectId();
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.assigned_counter = user.assigned_counter || new ObjectId() || "";
    this.verify = user.verify || UserVerifyStatus.Unverified;
    this.created_at = user.created_at || date;
    this.updated_at = user.updated_at || date;
  }
}
