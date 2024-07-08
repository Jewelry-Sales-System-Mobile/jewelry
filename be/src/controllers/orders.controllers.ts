import { get } from "lodash";
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import orderServices from "~/services/orders.services";
import {
  CreateOrderReqBody,
  OrderCodeReqParams,
  OrderIdReqParams,
} from "~/models/requests/Orders.requests";
import { CustomerIdReqParams } from "~/models/requests/Customers.requests";
import { TokenPayload } from "~/models/requests/Users.requests";

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
  const { user_id } = req.decoded_authorization as TokenPayload;

  const { order, addedPoints } = await orderServices.createOrder(
    req.body,
    user_id
  );
  return res.json({
    message: `Create order successfully. You got ${addedPoints} points.`,
    data: order,
    plus_points: addedPoints,
  });
};

export const confirmOrderController = async (
  req: Request<OrderIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const order = await orderServices.confirmOrder(order_id);
  return res.json({
    message: "Confirm order successfully",
    data: order,
  });
};

export const cancelOrderController = async (
  req: Request<OrderIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const order = await orderServices.cancelOrder(order_id);
  return res.json({
    message: "Cancel order successfully",
    data: order,
  });
};

export const getAllOrdersOfACustomerController = async (
  req: Request<CustomerIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.params;
  const orders = await orderServices.getAllOrdersOfACustomer(customer_id);
  return res.json({
    message: "Get all orders of a customer successfully",
    data: orders,
  });
};
