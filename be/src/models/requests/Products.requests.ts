import { ParamsDictionary } from "express-serve-static-core";
export interface CreateProductReqBody {
  name: string;
  weight: number;
  gemCost: number;
}

export interface ProductIdReqParams extends ParamsDictionary {
  product_id: string;
}

export interface DeleteProductImageReqBody {
  url: string;
}

export interface UpdateProductReqBody {
  name?: string;
  weight?: number;
  gemCost?: number;
}
