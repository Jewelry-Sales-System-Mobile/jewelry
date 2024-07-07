import express from "express";
import usersRouter from "./routers/users.routes";
import productsRouter from "./routers/products.routes";
import ordersRouter from "./routers/orders.routes";
import databaseService from "~/services/database.services";
import { defaultErrorHandler } from "./middlewares/errors.middlewares";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import goldPricesRouter from "./routers/gold_prices.routes";
import userService from "./services/users.services";
import { config } from "dotenv";
import { initFolder } from "./utils/file";
import counterRouter from "./routers/counter.routes";

config();
initFolder();
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
const port = 4000;
databaseService.connect();
app.use(cors());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/gold-prices", goldPricesRouter);
app.use("/counters", counterRouter);

app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
