import { ObjectId } from "mongodb";

interface CustomerType {
  _id?: ObjectId;
  name: string;
  phone: string;
  dob: Date;
  email: string;
  points?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export default class Customer {
  _id?: ObjectId;
  name: string;
  phone: string;
  dob: Date;
  email: string;
  points?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(customer: CustomerType) {
    const date = new Date();
    this._id = customer._id || new ObjectId();
    this.name = customer.name;
    this.phone = customer.phone;
    this.dob = customer.dob;
    this.email = customer.email;
    this.points = customer.points || 0;
    this.createdAt = customer.createdAt || date;
    this.updatedAt = customer.updatedAt || date;
  }
}
