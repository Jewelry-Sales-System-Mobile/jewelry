import { Router } from "express";
import {
  ActiveProductController,
  // addImageToProductController,
  CreateProductController,
  // deleteProductImageController,
  GetAllProductsController,
  GetProductByIdController,
  InActiveProductController,
  UpdateProductController,
} from "~/controllers/products.controllers";
import { filterMiddleware } from "~/middlewares/common.middlewares";
import { accessTokenValidator } from "~/middlewares/users.middlewares";
import { UpdateProductReqBody } from "~/models/requests/Products.requests";
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

/**
 * Description: Add image to product
 * Path: /:product_id/images
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {address: string}
 */
// productsRouter.post(
//   "/:product_id/images",
//   accessTokenValidator,
//   wrapRequestHandler(addImageToProductController)
// );

/**
 * Description: Delete Product Image
 * Path: /product/:product_id
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {address: string}
 */
// productsRouter.put(
//   "/:product_id/images/delete",
//   accessTokenValidator,
//   wrapRequestHandler(deleteProductImageController)
// );

/**
 * Description: Update Product
 * Route: PUT /:product_id
 * Body: UpdateProductReqBody
 * Header: Authorization: Bearer ${token}
 */
productsRouter.put(
  "/:product_id",
  accessTokenValidator,
  filterMiddleware<UpdateProductReqBody>(["name", "weight", "gemCost"]),
  wrapRequestHandler(UpdateProductController)
);

export default productsRouter;
