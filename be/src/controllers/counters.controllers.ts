import {
  counterIdReqParams,
  createCounterReqBody,
  employeeIdReqBody,
} from "./../models/requests/Counters.request";
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import counterServices from "~/services/counters.services";

export const createNewCounterController = async (
  req: Request<ParamsDictionary, any, createCounterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const newCounter = await counterServices.createCounter(name);
  return res.json({
    message: "New counter created",
    data: newCounter,
  });
};

export const getAllCountersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const counters = await counterServices.getAllCounters();
  return res.json({
    message: "Get All Counters Success",
    data: counters,
  });
};

export const getCounterByIdController = async (
  req: Request<counterIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { counter_id } = req.params;
  const counter = await counterServices.getCounterById(counter_id);
  return res.json({
    message: "Get counter By ID success",
    data: counter,
  });
};

export const deleteCounterController = async (
  req: Request<counterIdReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { counter_id } = req.params;
  const counter = await counterServices.deleteCounterById(counter_id);
  return res.json({
    message: "Delete counter success",
    data: counter,
  });
};

export const assignEmployeeToCounterController = async (
  req: Request<counterIdReqParams, any, employeeIdReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { counter_id } = req.params;
  const { employee_id } = req.body;
  const counter = await counterServices.assignEmployeeToCounter(
    counter_id,
    employee_id
  );
  return res.json({
    message: "Assign employee to counter success",
    data: counter,
  });
};

export const unAssignEmployeeToCounterController = async (
  req: Request<counterIdReqParams, any, employeeIdReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { counter_id } = req.params;
  const { employee_id } = req.body;
  const counter = await counterServices.unassignEmployeeFromCounter(
    counter_id,
    employee_id
  );
  return res.json({
    message: "Assign employee to counter success",
    data: counter,
  });
};
