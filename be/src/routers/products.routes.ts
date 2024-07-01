import { Router } from "express";
import {
  ActiveProductController,
  CreateProductController,
  GetAllProductsController,
  GetProductByIdController,
  InActiveProductController,
} from "~/controllers/products.controllers";
import { accessTokenValidator } from "~/middlewares/users.middlewares";
import { wrapRequestHandler } from "~/utils/handlers";
const productsRouter = Router();

/**
 * Description: Get All Product
 * Route: GET /
 */
productsRouter.get(
  "/",
  accessTokenValidator,
  wrapRequestHandler(GetAllProductsController)
);

/**
 * Description: Create new Product
 * Route: POST /
 * Body: CreateProductReqBody
 */
productsRouter.post(
  "/",
  accessTokenValidator,
  wrapRequestHandler(CreateProductController)
);

/**
 * Description: Get Product By Id
 * Route: GET /:product_id
 * Body: CreateProductReqBody
 */
productsRouter.get(
  "/:product_id",
  accessTokenValidator,
  wrapRequestHandler(GetProductByIdController)
);

/**
 * Description: Active Product
 * Route: POST /:product_id/active
 * Header: Authorization: Bearer ${token}
 */
productsRouter.post(
  "/:product_id/active",
  accessTokenValidator,
  wrapRequestHandler(ActiveProductController)
);

/**
 * Description: InActive Product
 * Route: POST /:product_id/inactive
 * Header: Authorization: Bearer ${token}
 */
productsRouter.post(
  "/:product_id/inactive",
  accessTokenValidator,
  wrapRequestHandler(InActiveProductController)
);
export default productsRouter;
