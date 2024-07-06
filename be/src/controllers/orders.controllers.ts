import { get } from "lodash";
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import orderServices from "~/services/orders.services";
import {
  CreateOrderReqBody,
  OrderCodeReqParams,
  OrderIdReqParams,
} from "~/models/requests/Orders.requests";

export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orders = await orderServices.getAllOrders();
  return res.json({
    message: "Get all orders successfully",
    data: orders,
  });
};

export const getOrderByIdController = async (
  req: Request<OrderIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const order = await orderServices.getOrderById(order_id);
  return res.json({
    message: "Get order by id successfully",
    data: order,
  });
};

export const getOrderByOrderCodeController = async (
  req: Request<OrderCodeReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { order_code } = req.params;
  const order = await orderServices.getOrderByOrderCode(order_code);
  return res.json({
    message: "Get order by id successfully",
    data: order,
  });
};

export const createOrderController = async (
  req: Request<ParamsDictionary, any, CreateOrderReqBody>,
  res: Response,
  next: NextFunction
) => {
  const order = await orderServices.createOrder(req.body);
  return res.json({
    message: "Create order successfully",
    data: order,
  });
};
