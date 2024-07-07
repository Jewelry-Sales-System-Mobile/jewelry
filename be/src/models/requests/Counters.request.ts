import { ParamsDictionary } from "express-serve-static-core";

export interface createCounterReqBody {
  name: string;
}

export interface counterIdReqParams extends ParamsDictionary {
  counter_id: string;
}

export interface employeeIdReqBody {
  employee_id: string;
}

export interface updateCounterNameReqBody {
  counter_name: string;
}
