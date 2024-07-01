import { ObjectId } from "mongodb";
import databaseService from "./database.services";
import { ChangeGoldPricesReqBody } from "~/models/requests/GoldPrices.request";

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

    return newPrice;
  }
}

const goldPricesServices = new GoldPricesServices();

export default goldPricesServices;
