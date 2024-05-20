import { ParamsDictionary } from "express-serve-static-core";
import { CollectionStatus } from "~/constants/enum";

export interface AddCollectionReqBody {
  name: string;
}

export interface UpdateCollectionReqBody {
  name?: string;
  status?: CollectionStatus;
}

export interface UpdateCollectionReqParams extends ParamsDictionary {
  collection_id: string;
}

export interface DeleteCollectionReqParams extends ParamsDictionary {
  collection_id: string;
}
