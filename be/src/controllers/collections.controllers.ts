import { ParamsDictionary } from "express-serve-static-core";
import { NextFunction, Request, Response } from "express";
import {
  AddCollectionReqBody,
  DeleteCollectionReqParams,
  UpdateCollectionReqBody,
  UpdateCollectionReqParams,
} from "~/models/requests/Collections.requests";
import collectionsService from "~/services/collections.services";
import { COLLECTIONS_MESSAGES } from "~/constants/messages";

export const addCollectionController = async (
  req: Request<ParamsDictionary, any, AddCollectionReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const collection = await collectionsService.addCollection(name);
  return res.json({
    message: COLLECTIONS_MESSAGES.ADD_COLLECTION_SUCCESS,
    data: collection,
  });
};

export const getAllCollectionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const collections = await collectionsService.getAllCollections();
  return res.json({
    message: COLLECTIONS_MESSAGES.GET_ALL_COLLECTIONS_SUCCESS,
    data: collections,
  });
};

export const updateCollectionController = async (
  req: Request<UpdateCollectionReqParams, any, UpdateCollectionReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { collection_id } = req.params;
  const body = req.body;

  const collection = await collectionsService.updateCollection(
    collection_id,
    body
  );
  return res.json({
    message: COLLECTIONS_MESSAGES.UPDATE_COLLECTION_SUCCESS,
    data: collection,
  });
};

export const deleteCollectionController = async (
  req: Request<DeleteCollectionReqParams>,
  res: Response,
  next: NextFunction
) => {
  const { collection_id } = req.params;
  const result = await collectionsService.deleteCollection(collection_id);
  return res.json(result);
};
