import { Router } from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrderByOrderCodeController,
} from "~/controllers/orders.controllers";
import { accessTokenValidator } from "~/middlewares/users.middlewares";
import { wrapRequestHandler } from "~/utils/handlers";

const ordersRouter = Router();

/**
 * Description: Get all orders
 * Route: GET /orders
 * Authentication: Bearer token
 */
ordersRouter.get(
  "/",
  accessTokenValidator,
  wrapRequestHandler(getAllOrdersController)
);

/**
 * Description: Get order by id
 * Route: GET /orders/:order_id
 * Authentication: Bearer token
 */
ordersRouter.get(
  "/:order_id",
  accessTokenValidator,
  wrapRequestHandler(getOrderByIdController)
);

/**
 * Description: Get order by order code
 * Route: GET /orders/:order_code
 * Authentication: Bearer token
 */
ordersRouter.get(
  "/:order_code",
  accessTokenValidator,
  wrapRequestHandler(getOrderByOrderCodeController)
);

/**
 * Description: Create new order
 * Route: POST /orders
 * Authentication: Bearer token
 * Body: CreateOrderReqBody
 */
ordersRouter.post(
  "/",
  accessTokenValidator,
  wrapRequestHandler(createOrderController)
);

export default ordersRouter;
