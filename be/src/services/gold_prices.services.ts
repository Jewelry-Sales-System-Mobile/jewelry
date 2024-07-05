import { ObjectId } from "mongodb";
import databaseService from "./database.services";
import { ChangeGoldPricesReqBody } from "~/models/requests/GoldPrices.request";
import { LABOR_COST, ONE_TEIL_GOLD } from "~/constants/constant";

class GoldPricesServices {
  async getGoldPrices() {
    const goldPrice = await databaseService.gold_prices.findOne();
    return goldPrice;
  }

  async changeGoldPrices(body: ChangeGoldPricesReqBody) {
    const newPrice = await databaseService.gold_prices.findOneAndUpdate(
      { _id: new ObjectId("66817449df09ed0397a51546") },
      {
        $set: {
          ...body,
        },
        $currentDate: { updated_at: true },
      },
      { returnDocument: "after" }
    );
    const products = await databaseService.products.find().toArray();

    for (const product of products) {
      const teil = product.weight / ONE_TEIL_GOLD;
      const laborCost = teil * LABOR_COST * (newPrice?.sell_price as number);
      const basePrice =
        (newPrice?.sell_price as number) * teil + laborCost + product.gemCost;

      await databaseService.products.updateOne(
        { _id: product._id },
        {
          $set: {
            laborCost: laborCost,
            basePrice: basePrice,
          },
          $currentDate: { updated_at: true },
        }
      );
    }

    return newPrice;
  }
}

const goldPricesServices = new GoldPricesServices();

export default goldPricesServices;
