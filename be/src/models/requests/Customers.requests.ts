import { ParamsDictionary } from "express-serve-static-core";
export interface CustomerIdReqParams extends ParamsDictionary {
  customer_id: string;
}

export interface CreateCustomerReqBody {
  name: string;
  phone: string;
  dob: string;
  email: string;
}

export interface UpdateCustomerReqBody {
  name?: string;
  phone?: string;
  dob?: string;
  email?: string;
}
