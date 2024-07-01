import { NextFunction, Request, Response } from "express";
import { checkSchema } from "express-validator";
import { pick } from "lodash";
import { validate } from "~/utils/validation";

type FilterKeys<T> = Array<keyof T>;

export const filterMiddleware =
  <T>(filterKey: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKey);
    next();
  };

export const changeGoldPricesValidator = validate(
  checkSchema(
    {
      sell_price: {
        optional: true,
        custom: {
          options: (value) => {
            // Check if the value is a number
            return typeof value === "number";
          },
          errorMessage: "Price must be a number",
        },
      },
      buy_price: {
        optional: true,
        custom: {
          options: (value) => {
            // Check if the value is a number
            return typeof value === "number";
          },
          errorMessage: "Price must be a number",
        },
      },
    },
    ["body"]
  )
);
