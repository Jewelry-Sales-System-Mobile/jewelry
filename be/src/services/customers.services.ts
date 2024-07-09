import { ObjectId } from "mongodb";
import databaseService from "./database.services";
import { ErrorWithStatus } from "~/models/Errors";
import HTTP_STATUS from "~/constants/httpStatus";
import {
  CreateCustomerReqBody,
  UpdateCustomerReqBody,
} from "~/models/requests/Customers.requests";

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
      dob: new Date(body.dob),
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newCustomer = await databaseService.customers.findOne({
      _id: insertedId,
    });

    return newCustomer;
  }

  async updateCustomer(customer_id: string, body: UpdateCustomerReqBody) {
    const _body = body.dob ? { ...body, dob: new Date(body.dob) } : body;
    const updatedCustomer = await databaseService.customers.findOneAndUpdate(
      { _id: new ObjectId(customer_id) },
      {
        $set: {
          ...(_body as UpdateCustomerReqBody & { dob?: Date }),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    return updatedCustomer;
  }

  async checkEmailExists(email: string) {
    return Boolean(await databaseService.customers.findOne({ email }));
  }

  async checkPhoneNumberExists(phoneNumber: string) {
    return Boolean(
      await databaseService.customers.findOne({ phone: phoneNumber })
    );
  }
}

const customerServices = new CustomerServices();
export default customerServices;
