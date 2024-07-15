import { Router } from "express";
import {
  cancelOrderController,
  confirmOrderController,
  createOrderController,
  getAllOrdersController,
  getAllOrdersOfACustomerController,
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

/**
 * Description: Confirm order
 * Route: PUT /orders/:order_id/confirm
 * Authentication: Bearer token
 */
ordersRouter.put(
  "/:order_id/confirm",
  accessTokenValidator,
  wrapRequestHandler(confirmOrderController)
);

/**
 * Description: Cancel order
 * Route: PUT /orders/:order_id/cancel
 * Authentication: Bearer token
 */
ordersRouter.put(
  "/:order_id/cancel",
  accessTokenValidator,
  wrapRequestHandler(cancelOrderController)
);

/**
 * Description: Get all orders of customer
 * Route: GET /orders/by-customer/:customer_id
 */
ordersRouter.get(
  "/by-customer/:customer_id",
  wrapRequestHandler(getAllOrdersOfACustomerController)
);
export default ordersRouter;
