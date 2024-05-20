import express from "express";
import usersRouter from "./routers/users.routes";
import productsRouter from "./routers/products.routes";
import collectionsRouter from "./routers/collections.routes";
import ordersRouter from "./routers/orders.routes";
import databaseService from "~/services/database.services";
import { defaultErrorHandler } from "./middlewares/errors.middlewares";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { config } from "dotenv";

config();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Usera API",
      version: "1.0.0",
      description: "A simple API for users",
    },
  },
  apis: ["./swagger/*.yaml"],
};
const openapiSpecification = swaggerJsdoc(options);

const app = express();
const port = 8080;
databaseService.connect();

app.use(cors());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/collections", collectionsRouter);
app.use("/orders", ordersRouter);

app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
