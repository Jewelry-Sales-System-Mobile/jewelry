import { ObjectId } from "mongodb";
import databaseService from "./database.services";
import { ErrorWithStatus } from "~/models/Errors";
import HTTP_STATUS from "~/constants/httpStatus";
import { CreateOrderReqBody } from "~/models/requests/Orders.requests";
import { PaymentStatus } from "~/constants/enum";

class OrderServices {
  async generateUniqueOrderCode() {
    let unique = false;
    let orderCode;
    while (!unique) {
      orderCode = this.generateRandomCode(8);
      // Check if productCode exists in the database
      const exists = await databaseService.orders.findOne({
        order_code: orderCode,
      });
      if (!exists) unique = true;
    }
    return orderCode;
  }

  generateRandomCode(length: number) {
    const numbers = "0123456789";
    let result = "OD"; // Start with PD
    const numbersLength = numbers.length;
    for (let i = 0; i < 6; i++) {
      // Generate 6 random numeric characters
      result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }
    return result;
  }

  async getAllOrders() {
    return await databaseService.orders.find().toArray();
  }

  async getOrderById(order_id: string) {
    const order = await databaseService.orders.findOne({
      _id: new ObjectId(order_id),
    });

    if (!order) {
      throw new ErrorWithStatus("Order not found", HTTP_STATUS.NOT_FOUND);
    }

    return order;
  }

  async getOrderByOrderCode(order_code: string) {
    const order = await databaseService.orders.findOne({
      order_code: order_code,
    });

    if (!order) {
      throw new ErrorWithStatus("Order not found", HTTP_STATUS.NOT_FOUND);
    }

    return order;
  }

  async createOrder(body: CreateOrderReqBody, user_id: string) {
    const orderCode = await this.generateUniqueOrderCode();
    const newBody = {
      _id: new ObjectId(),
      customer_id: new ObjectId(body.customer_id),
      staff_id: new ObjectId(user_id),
      order_details: body.order_details,
      order_code: orderCode,
      subtotal: body.subtotal,
      discount: body.discount,
      total: body.total,
      paymentStatus: PaymentStatus.Pending,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { insertedId } = await databaseService.orders.insertOne(newBody);

    const order = await databaseService.orders.findOne({ _id: insertedId });
    const addedPoints = Math.floor(body.total / 100000);
    console.log(addedPoints);

    if (body.discount > 0) {
      const discountPoints = Math.floor(body.discount / 100000) * 100 * -1;
      await databaseService.customers.updateOne(
        { _id: new ObjectId(body.customer_id) },
        { $inc: { points: discountPoints } }
      );
    }
    await databaseService.customers.updateOne(
      { _id: new ObjectId(body.customer_id) },
      { $inc: { points: addedPoints } }
    );
    return { order, addedPoints };
  }

  async confirmOrder(order_id: string) {
    const order = await this.getOrderById(order_id);

    if (!order) {
      throw new ErrorWithStatus("Order not found", HTTP_STATUS.NOT_FOUND);
    }

    if (order.paymentStatus === PaymentStatus.Paid) {
      throw new ErrorWithStatus(
        "Order has already been paid",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      { _id: new ObjectId(order_id) },
      {
        $set: {
          paymentStatus: PaymentStatus.Paid,
          total: order.total,
        },
        $currentDate: { updated_at: true },
      },
      {
        returnDocument: "after",
      }
    );

    return updatedOrder;
  }

  async cancelOrder(order_id: string) {
    const order = await this.getOrderById(order_id);

    if (!order) {
      throw new ErrorWithStatus("Order not found", HTTP_STATUS.NOT_FOUND);
    }

    if (order.paymentStatus === PaymentStatus.Paid) {
      const updatedOrder = await databaseService.orders.findOneAndUpdate(
        { _id: new ObjectId(order_id) },
        {
          $set: {
            paymentStatus: PaymentStatus.Cancelled,
            total: order.total * -1,
          },
          $currentDate: { updated_at: true },
        },
        {
          returnDocument: "after",
        }
      );
    }

    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      { _id: new ObjectId(order_id) },
      {
        $set: {
          paymentStatus: PaymentStatus.Cancelled,
          total: 0,
        },
        $currentDate: { updated_at: true },
      },
      {
        returnDocument: "after",
      }
    );

    return updatedOrder;
  }

  async getAllOrdersOfACustomer(customer_id: string) {
    return await databaseService.orders
      .find({ customer_id: new ObjectId(customer_id) })
      .toArray();
  }
}

const orderServices = new OrderServices();
export default orderServices;
