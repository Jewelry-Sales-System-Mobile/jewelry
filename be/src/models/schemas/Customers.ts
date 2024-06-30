import { ObjectId } from "mongodb";

interface CustomerType {
  _id?: ObjectId;
  name: String;
  phone: String;
  dob: Date;
  email: String;
  points: Number;
  createdAt: Date;
  updatedAt?: Date;
}

export default class Customer {
  _id?: ObjectId;
  name: String;
  phone: String;
  dob: Date;
  email: String;
  points: Number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(customer: CustomerType) {
    const date = new Date();
    this._id = customer._id || new ObjectId();
    this.name = customer.name;
    this.phone = customer.phone;
    this.dob = customer.dob;
    this.email = customer.email;
    this.points = customer.points;
    this.createdAt = customer.createdAt || date;
    this.updatedAt = customer.updatedAt || date;
  }
}
