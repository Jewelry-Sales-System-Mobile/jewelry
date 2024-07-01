import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ChangeGoldPricesReqBody } from "~/models/requests/GoldPrices.request";

import goldPricesServices from "~/services/gold_prices.services";

export const getGoldPricesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const goldPrices = await goldPricesServices.getGoldPrices();
  return res.json({
    message: "Get gold prices successfully",
    data: goldPrices,
  });
};

export const changeGoldPricesController = async (
  req: Request<ParamsDictionary, any, ChangeGoldPricesReqBody>,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  const newPrice = await goldPricesServices.changeGoldPrices(body);
  return res.json({
    message: "Change gold prices successfully",
    data: newPrice,
  });
};
