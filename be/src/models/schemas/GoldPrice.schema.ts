import { ObjectId } from "mongodb";

interface GoldPriceType {
  _id?: ObjectId;
  sell_price: number;
  buy_price: number;
  updated_at?: Date;
}

export default class GoldPrices {
  _id?: ObjectId;
  sell_price: number;
  buy_price: number;
  updated_at?: Date;

  constructor(goldPrice: GoldPriceType) {
    const date = new Date();
    this._id = goldPrice._id;
    this.sell_price = goldPrice.sell_price || 0;
    this.buy_price = goldPrice.buy_price || 0;
    this.updated_at = goldPrice.updated_at || date;
  }
}
