import { ParamsDictionary } from "express-serve-static-core";
import { OrderDetail } from "../schemas/Orders.schema";
export interface OrderIdReqParams extends ParamsDictionary {
  order_id: string;
}

export interface OrderCodeReqParams extends ParamsDictionary {
  order_code: string;
}

export interface CreateOrderReqBody {
  customer_id: string;
  order_details: OrderDetail[];
  subtotal: number;
  discount: number;
  total: number;
}
