import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import {
  CreateProductReqBody,
  ProductIdReqParams,
} from "~/models/requests/Products.requests";
import productServices from "~/services/products.services";

export const CreateProductController = async (
  req: Request<ParamsDictionary, any, CreateProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  const product = await productServices.createProduct(body);
  return res.json({
    message: "Create product successfully",
    data: product,
  });
};

export const ActiveProductController = async (
  req: Request<ProductIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { product_id } = req.params;
  const product = await productServices.activeProduct(product_id);
  return res.json({
    message: "Active product successfully",
    data: product,
  });
};

export const InActiveProductController = async (
  req: Request<ProductIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { product_id } = req.params;
  const product = await productServices.inActiveProduct(product_id);
  return res.json({
    message: "Active product successfully",
    data: product,
  });
};

export const GetAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await productServices.getAllProducts();
  return res.json({
    message: "Get all product successfully",
    data: products,
  });
};

export const GetProductByIdController = async (
  req: Request<ProductIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { product_id } = req.params;
  const product = await productServices.getProductById(product_id);
  return res.json({
    message: "Get product successfully",
    data: product,
  });
};
