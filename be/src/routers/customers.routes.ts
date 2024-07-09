import { Router } from "express";
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
} from "~/controllers/customers.controllers";
import { filterMiddleware } from "~/middlewares/common.middlewares";
import {
  accessTokenValidator,
  createCustomerValidator,
} from "~/middlewares/users.middlewares";
import { UpdateCustomerReqBody } from "~/models/requests/Customers.requests";
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
  createCustomerValidator,
  wrapRequestHandler(createCustomerController)
);

/**
 * Description: Update customer by ID
 * Route: PUT /customers/:customer_id
 * Authentication: Bearer token
 * Body: UpdateCustomerReqBody
 */
customerRouter.put(
  "/:customer_id",
  accessTokenValidator,
  filterMiddleware<UpdateCustomerReqBody>(["dob", "email", "name", "phone"]),
  wrapRequestHandler(updateCustomerController)
);

/** */
export default customerRouter;
