import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import {
  CreateCustomerReqBody,
  CustomerIdReqParams,
  UpdateCustomerReqBody,
} from "~/models/requests/Customers.requests";
import customerServices from "~/services/customers.services";

export const getAllCustomersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customers = await customerServices.getAllCustomers();
  return res.json({
    message: "Get all customers successfully",
    data: customers,
  });
};

export const getCustomerByIdController = async (
  req: Request<CustomerIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.params;
  const customer = await customerServices.getCustomerById(customer_id);
  return res.json({
    message: "Get customer by ID successfully",
    data: customer,
  });
};

export const createCustomerController = async (
  req: Request<ParamsDictionary, any, CreateCustomerReqBody>,
  res: Response,
  next: NextFunction
) => {
  const customer = await customerServices.createCustomer(req.body);
  return res.json({
    message: "Create customer successfully",
    data: customer,
  });
};

export const updateCustomerController = async (
  req: Request<CustomerIdReqParams, any, UpdateCustomerReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { customer_id } = req.params;
  const customer = await customerServices.updateCustomer(customer_id, req.body);
  return res.json({
    message: "Update customer successfully",
    data: customer,
  });
};
