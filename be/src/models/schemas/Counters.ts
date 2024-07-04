import { ObjectId } from "mongodb";

interface CounterType {
  _id?: ObjectId;
  counter_name: String;
  assignedEmployees: ObjectId[]; // reference to Employees collection
  created_at?: Date;
  updated_at?: Date;
}

export default class Counter {
  _id?: ObjectId;
  counter_name: String;
  assignedEmployees: ObjectId[];
  created_at?: Date;
  updated_at?: Date;

  constructor(counter: CounterType) {
    const date = new Date();
    this._id = counter._id || new ObjectId();
    this.counter_name = counter.counter_name;
    this.assignedEmployees = counter.assignedEmployees || [];
    this.created_at = counter.created_at || date;
    this.updated_at = counter.updated_at || date;
  }
}
