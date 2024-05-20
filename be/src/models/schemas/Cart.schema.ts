import { ObjectId } from "mongodb";
import Product from "./Product.chema";

interface CartType {
  _id: ObjectId;
  user_id: ObjectId;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
  products: Product[];
}
