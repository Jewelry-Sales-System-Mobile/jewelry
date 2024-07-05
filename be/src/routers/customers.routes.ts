import { Router } from "express";
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
} from "~/controllers/customers.controllers";
import { accessTokenValidator } from "~/middlewares/users.middlewares";
import { wrapRequestHandler } from "~/utils/handlers";

const customerRouter = Router();

/**
 * Description: Get all customers
 * Route: GET /customers
 * Authentication: Bearer token
 */
customerRouter.get(
  "/",
  accessTokenValidator,
  wrapRequestHandler(getAllCustomersController)
);

/**
 * Description: Get customer by ID
 * Route: GET /customers/:customer_id
 * Authentication: Bearer token
 */
customerRouter.get(
  "/:customer_id",
  accessTokenValidator,
  wrapRequestHandler(getCustomerByIdController)
);

/**
 * Description: Create a new customer
 * Route: POST /customers
 * Authentication: Bearer token
 * Body: CreateCustomerReqBody
 */
customerRouter.post(
  "/",
  accessTokenValidator,
  wrapRequestHandler(createCustomerController)
);

/** */
export default customerRouter;
