import { ObjectId } from "mongodb";
import { PaymentStatus } from "~/constants/enum";

export interface OrderDetail {
  productId: ObjectId; // reference to Products collection
  quantity: number;
  unitPrice: number;
}

interface OrderType {
  _id?: ObjectId;
  customer_id: ObjectId; // reference to Customers collection
  order_details: OrderDetail[];
  order_code?: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus; // pending, paid
  created_at?: Date;
  updated_at?: Date;
}

export default class Order {
  _id?: ObjectId;
  customer_id: ObjectId;
  order_details: OrderDetail[];
  order_code?: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  created_at?: Date;
  updated_at?: Date;

  constructor(order: OrderType) {
    const date = new Date();
    this._id = order._id || new ObjectId();
    this.customer_id = order.customer_id;
    this.order_details = order.order_details;
    this.order_code = order.order_code || "";
    this.subtotal = order.subtotal;
    this.discount = order.discount;
    this.total = order.total;
    this.paymentStatus = order.paymentStatus;
    this.created_at = order.created_at || date;
    this.updated_at = order.updated_at || date;
  }
}
