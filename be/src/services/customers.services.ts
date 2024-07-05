import { ObjectId } from "mongodb";
import databaseService from "./database.services";
import { ErrorWithStatus } from "~/models/Errors";
import HTTP_STATUS from "~/constants/httpStatus";
import { CreateCustomerReqBody } from "~/models/requests/Customers.requests";

class CustomerServices {
  async getAllCustomers() {
    return await databaseService.customers.find().toArray();
  }

  async getCustomerById(customerId: string) {
    const customer = await databaseService.customers.findOne({
      _id: new ObjectId(customerId),
    });
    if (!customer) {
      throw new ErrorWithStatus("Customer not found", HTTP_STATUS.NOT_FOUND);
    }
    return customer;
  }
  async createCustomer(body: CreateCustomerReqBody) {
    const { insertedId } = await databaseService.customers.insertOne({
      ...body,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newCustomer = await databaseService.customers.findOne({
      _id: insertedId,
    });

    return newCustomer;
  }
}

const customerServices = new CustomerServices();
export default customerServices;
