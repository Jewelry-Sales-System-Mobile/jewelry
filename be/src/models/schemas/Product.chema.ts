import { ObjectId } from "mongodb";
import { ProductStatus } from "~/constants/enum";

type ProductImage = {
  _id: ObjectId;
  url: string;
};

interface ProductType {
  _id?: ObjectId;
  name: string;
  barcode?: string;
  productCode?: string;
  weight: number;
  image_url?: string;
  laborCost?: number; // Tiền công (0.3% của giá vàng)
  gemCost: number; // Tiền đá ???
  basePrice?: number; // (latestGoldPrice * weight) + laborCost + gemCost
  created_at?: Date;
  updated_at?: Date;
  status: ProductStatus;
}

export default class Product {
  _id?: ObjectId;
  name: string;
  barcode?: string;
  productCode?: string;
  weight: number;
  image_url?: string;
  laborCost?: number; // Tiền công
  gemCost: number; // Tiền đá ???
  basePrice?: number; // (latestGoldPrice * weight) + laborCost + gemCost
  created_at?: Date;
  updated_at?: Date;
  status: ProductStatus;

  constructor(product: ProductType) {
    this._id = product._id || new ObjectId();
    this.name = product.name;
    this.barcode = product.barcode || "";
    this.productCode = product.productCode || "";
    this.image_url = product.image_url || "";
    this.weight = product.weight;
    this.laborCost = product.laborCost || 0;
    this.gemCost = product.gemCost;
    this.basePrice = product.basePrice || 0;
    this.created_at = product.created_at || new Date();
    this.updated_at = product.updated_at || new Date();
    this.status = product.status || ProductStatus.Active;
  }
}
