import { Router } from "express";
import {
  assignEmployeeToCounterController,
  createNewCounterController,
  deleteCounterController,
  getAllCountersController,
  getCounterByIdController,
  unAssignEmployeeToCounterController,
  updateCounterNameController,
} from "~/controllers/counters.controllers";
import { accessTokenValidator } from "~/middlewares/users.middlewares";
import { wrapRequestHandler } from "~/utils/handlers";

const counterRouter = Router();

/**
 * Description: Create a new counter
 * Route: POST /counters
 * Request body: { name: string }
 * Authorization: Required
 */
counterRouter.post(
  "/",
  accessTokenValidator,
  wrapRequestHandler(createNewCounterController)
);

/**
 * Description: Get all counters
 * Route: GET /counters
 * Authorization: Required
 */
counterRouter.get(
  "/",
  accessTokenValidator,
  wrapRequestHandler(getAllCountersController)
);

/**
 * Description: Get counter By Id
 * Route: GET /counters/:counter_id
 * Authorization: Required
 */
counterRouter.get(
  "/:counter_id",
  accessTokenValidator,
  wrapRequestHandler(getCounterByIdController)
);

/**
 * Description: Delete counter By Id
 * Route: GET /counters/:counter_id
 * Authorization: Required
 */
counterRouter.delete(
  "/:counter_id",
  accessTokenValidator,
  wrapRequestHandler(deleteCounterController)
);

/**
 * Description: Assign employee to counter
 * Route: POST /counters/:counter_id/assign
 * Request body: { employee_id: string }
 * Authorization: Required
 */
counterRouter.post(
  "/:counter_id/assign",
  accessTokenValidator,
  wrapRequestHandler(assignEmployeeToCounterController)
);

/**
 * Description: Unassign employee from counter
 * Route: DELETE /counters/:counter_id/unassign
 * Authorization: Required
 */
counterRouter.delete(
  "/:counter_id/unassign",
  accessTokenValidator,
  wrapRequestHandler(unAssignEmployeeToCounterController)
);

/**
 * Description: Update counter name
 * Route: PUT /counters/:counter_id
 * Request body: { counter_name: string }
 */
counterRouter.put(
  "/:counter_id",
  accessTokenValidator,
  wrapRequestHandler(updateCounterNameController)
);

export default counterRouter;
