import { Router } from "express";
import {
  addCollectionController,
  deleteCollectionController,
  getAllCollectionController,
  updateCollectionController,
} from "~/controllers/collections.controllers";
import {
  addNewCollectionValidator,
  updateCollectionValidator,
} from "~/middlewares/collections.middlewares";
import { filterMiddleware } from "~/middlewares/common.middlewares";
import {
  accessTokenValidator,
  roleAdminValidator,
} from "~/middlewares/users.middlewares";
import { UpdateCollectionReqBody } from "~/models/requests/Collections.requests";
import { wrapRequestHandler } from "~/utils/handlers";

const collectionsRouter = Router();

/**
 * Description: Get all collection
 * Path: /
 * Method: GET
 */
collectionsRouter.get("/", wrapRequestHandler(getAllCollectionController));

/**
 * Description: Add new collection
 * Path: /collection
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {name: string}
 */
collectionsRouter.post(
  "/collection",
  accessTokenValidator,
  roleAdminValidator,
  addNewCollectionValidator,
  wrapRequestHandler(addCollectionController)
);

/**
 * Description: Update collection
 * Route: [PATCH] /:collection_id
 * Header: {Authorization: Bearer <access_token>}
 * Body: {name: string, status: CollectionStatus}
 */
collectionsRouter.patch(
  "/:collection_id",
  accessTokenValidator,
  roleAdminValidator,
  updateCollectionValidator,
  filterMiddleware<UpdateCollectionReqBody>(["name", "status"]),
  wrapRequestHandler(updateCollectionController)
);

/**
 * Description: Update collection
 * Route: [DELETE] /:collection_id
 * Header: {Authorization: Bearer <access_token>}
 */
collectionsRouter.delete(
  "/:collection_id",
  accessTokenValidator,
  roleAdminValidator,
  wrapRequestHandler(deleteCollectionController)
);

export default collectionsRouter;
