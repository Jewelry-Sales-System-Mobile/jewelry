import { wrapRequestHandler } from "~/utils/handlers";
import { Router } from "express";
import {
  changeGoldPricesController,
  getGoldPricesController,
} from "~/controllers/gold_prices.controllers";
import {
  changeGoldPricesValidator,
  filterMiddleware,
} from "~/middlewares/common.middlewares";
import { ChangeGoldPricesReqBody } from "~/models/requests/GoldPrices.request";
import { accessTokenValidator } from "~/middlewares/users.middlewares";

const goldPricesRouter = Router();

/**
 * Description: Get gold prices
 * Route: GET /
 */
goldPricesRouter.get(
  "/",
  accessTokenValidator,
  wrapRequestHandler(getGoldPricesController)
);

/**
 * Description: Change Gold Prices
 * Route: PATCH /
 * Body: {
 *  sell_price?: number;
 *  buy_price?: number;
 * }
 */
goldPricesRouter.patch(
  "/",
  accessTokenValidator,
  changeGoldPricesValidator,
  filterMiddleware<ChangeGoldPricesReqBody>(["sell_price", "buy_price"]),
  wrapRequestHandler(changeGoldPricesController)
);

export default goldPricesRouter;
