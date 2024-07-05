import { MongoClient, ServerApiVersion, Db, Collection } from "mongodb";
import { config } from "dotenv";
import User from "~/models/schemas/User.schema";
import Product from "~/models/schemas/Product.chema";
import { envConfig } from "~/constants/config";
import GoldPrices from "~/models/schemas/GoldPrice.schema";
import Counter from "~/models/schemas/Counters";
import Customer from "~/models/schemas/Customers";
import Order from "~/models/schemas/Orders";
config();

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@jewelry.9tiipyy.mongodb.net/`;

class DatabaseService {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    this.db = this.client.db(envConfig.dbName);
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (error) {
      // await this.client.close();
      console.log(error);
    }
  }

  get users(): Collection<User> {
    return this.db.collection("users");
  }

  get gold_prices(): Collection<GoldPrices> {
    return this.db.collection("gold_prices");
  }

  get products(): Collection<Product> {
    return this.db.collection("products");
  }

  get counters(): Collection<Counter> {
    return this.db.collection("counters");
  }

  get customers(): Collection<Customer> {
    return this.db.collection("customers");
  }

  get orders(): Collection<Order> {
    return this.db.collection("orders");
  }
}

const databaseService = new DatabaseService();
export default databaseService;
