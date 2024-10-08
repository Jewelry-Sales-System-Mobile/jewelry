import { ObjectId } from "mongodb";
import databaseService from "./database.services";
import { ErrorWithStatus } from "~/models/Errors";
import HTTP_STATUS from "~/constants/httpStatus";

class CounterServices {
  async createCounter(name: string) {
    // create new counter
    const { insertedId } = await databaseService.counters.insertOne({
      counter_name: name,
      assignedEmployees: [],
      created_at: new Date(),
      updated_at: new Date(),
    });

    // return the new counter
    return await databaseService.counters.findOne({ _id: insertedId });
  }

  async getAllCounters() {
    return await databaseService.counters.find().toArray();
  }

  async getCounterById(counter_id: string) {
    const counter = await databaseService.counters.findOne({
      _id: new ObjectId(counter_id),
    });
    if (!counter) {
      throw new ErrorWithStatus("Counter not found", HTTP_STATUS.NOT_FOUND);
    }
    return counter;
  }

  async deleteCounterById(counter_id: string) {
    const counter = await databaseService.counters.findOneAndDelete({
      _id: new ObjectId(counter_id),
    });

    return counter;
  }

  async assignEmployeeToCounter(counter_id: string, employee_id: string) {
    const counter = await databaseService.counters.findOne({
      _id: new ObjectId(counter_id),
    });

    if (!counter) {
      throw new ErrorWithStatus("Counter not found", HTTP_STATUS.NOT_FOUND);
    }

    const employee = await databaseService.users.findOne({
      _id: new ObjectId(employee_id),
    });

    if (!employee) {
      throw new ErrorWithStatus("Employee not found", HTTP_STATUS.NOT_FOUND);
    }

    // Check if employee is already assigned to the counter
    if (
      counter.assignedEmployees.map((id) => id.toString()).includes(employee_id)
    ) {
      throw new ErrorWithStatus(
        "Employee already assigned in this counter",
        HTTP_STATUS.CREATED
      );
    }

    // Check if employee is assigned to another counter
    if (
      employee.assigned_counter &&
      employee.assigned_counter.toString() !== counter_id
    ) {
      throw new ErrorWithStatus(
        "Employee is assigned to another counter",
        HTTP_STATUS.CREATED
      );
    }

    const updatedCounter = await databaseService.counters.findOneAndUpdate(
      { _id: new ObjectId(counter_id) },
      {
        $push: {
          assignedEmployees: new ObjectId(employee_id),
        },
        $currentDate: { updated_at: true },
      },
      { returnDocument: "after" }
    );

    await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(employee_id) },
      {
        $set: {
          assigned_counter: new ObjectId(counter_id),
        },
        $currentDate: { updated_at: true },
      }
    );

    return updatedCounter;
  }

  async unassignEmployeeFromCounter(counter_id: string, employee_id: string) {
    const counter = await databaseService.counters.findOne({
      _id: new ObjectId(counter_id),
    });

    if (!counter) {
      throw new ErrorWithStatus("Counter not found", HTTP_STATUS.NOT_FOUND);
    }

    const employee = await databaseService.users.findOne({
      _id: new ObjectId(employee_id),
    });

    if (!employee) {
      throw new ErrorWithStatus("Employee not found", HTTP_STATUS.NOT_FOUND);
    }

    // Check if employee is not assigned to the counter
    if (
      !counter.assignedEmployees
        .map((id) => id.toString())
        .includes(employee_id)
    ) {
      throw new ErrorWithStatus(
        "Employee not assigned to the counter",
        HTTP_STATUS.NOT_FOUND
      );
    }

    const updatedCounter = await databaseService.counters.findOneAndUpdate(
      { _id: new ObjectId(counter_id) },
      {
        $pull: {
          assignedEmployees: new ObjectId(employee_id),
        },
        $currentDate: { updated_at: true },
      },
      { returnDocument: "after" }
    );

    await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(employee_id) },
      {
        $set: {
          assigned_counter: "",
        },
        $currentDate: { updated_at: true },
      }
    );

    return updatedCounter;
  }
  async updateCounterName(counter_id: string, name: string) {
    const counter = await databaseService.counters.findOne({
      _id: new ObjectId(counter_id),
    });

    if (!counter) {
      throw new ErrorWithStatus("Counter not found", HTTP_STATUS.NOT_FOUND);
    }

    const updatedCounter = await databaseService.counters.findOneAndUpdate(
      { _id: new ObjectId(counter_id) },
      {
        $set: {
          counter_name: name,
        },
        $currentDate: { updated_at: true },
      },
      { returnDocument: "after" }
    );

    return updatedCounter;
  }
}

const counterServices = new CounterServices();
export default counterServices;
