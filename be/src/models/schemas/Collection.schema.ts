import { ObjectId } from "mongodb";
import { CollectionStatus } from "~/constants/enum";

interface CollectionType {
  _id: ObjectId;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  status: CollectionStatus;
}

export default class Collection {
  _id: ObjectId;
  name: string;
  created_at: Date;
  updated_at: Date;
  status: CollectionStatus;

  constructor(collection: CollectionType) {
    const date = new Date();
    this._id = collection._id;
    this.name = collection.name || "";
    this.created_at = collection.created_at || date;
    this.updated_at = collection.updated_at || date;
    this.status = collection.status || CollectionStatus.Active;
  }
}
