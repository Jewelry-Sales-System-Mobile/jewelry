import { LABOR_COST } from "./../constants/constant";
import { CreateProductReqBody } from "~/models/requests/Products.requests";
import databaseService from "./database.services";
import goldPricesServices from "./gold_prices.services";
import { ONE_TEIL_GOLD } from "~/constants/constant";
import { ObjectId } from "mongodb";
import { ProductStatus } from "~/constants/enum";
import { ErrorWithStatus } from "~/models/Errors";
import HTTP_STATUS from "~/constants/httpStatus";

class ProductServices {
  async generateUniqueProductCode() {
    let unique = false;
    let productCode;
    while (!unique) {
      productCode = this.generateRandomCode(8);
      // Check if productCode exists in the database
      const exists = await databaseService.products.findOne({
        barcode: productCode,
      });
      if (!exists) unique = true;
    }
    return productCode;
  }

  generateRandomCode(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "PD"; // Start with PD
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async createProduct(body: CreateProductReqBody) {
    const { gemCost, name, weight } = body;
    const goldPrice = await goldPricesServices.getGoldPrices();
    const goldPricePerTeil = goldPrice?.sell_price;
    const teil = weight / ONE_TEIL_GOLD;
    const laborCost = teil * LABOR_COST * (goldPricePerTeil as number);
    let productCode = await this.generateUniqueProductCode();

    const newBody = {
      _id: new ObjectId(),
      name: name,
      barcode: "",
      productCode,
      weight: weight,
      laborCost: laborCost,
      gemCost: gemCost,
      basePrice: (goldPricePerTeil as number) * teil + laborCost + gemCost,
      created_at: new Date(),
      updated_at: new Date(),
      status: ProductStatus.Active,
    };
    const { insertedId } = await databaseService.products.insertOne(newBody);
    const product = await databaseService.products.findOne({ _id: insertedId });
    return product;
  }

  async activeProduct(productId: string) {
    const product = await databaseService.products.findOne({
      _id: new ObjectId(productId),
    });
    if (!product)
      throw new ErrorWithStatus("Product not found", HTTP_STATUS.NOT_FOUND);
    if (product.status === ProductStatus.Active) {
      throw new ErrorWithStatus(
        "Product is already active",
        HTTP_STATUS.FORBIDDEN
      );
    }
    const newProduct = await databaseService.products.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      {
        $set: { status: ProductStatus.Active },
        $currentDate: { updated_at: true },
      },
      {
        returnDocument: "after",
      }
    );
    return newProduct;
  }

  async inActiveProduct(productId: string) {
    const product = await databaseService.products.findOne({
      _id: new ObjectId(productId),
    });
    if (!product)
      throw new ErrorWithStatus("Product not found", HTTP_STATUS.NOT_FOUND);
    if (product.status === ProductStatus.Inactive) {
      throw new ErrorWithStatus(
        "Product is already inactive",
        HTTP_STATUS.FORBIDDEN
      );
    }
    const newProduct = await databaseService.products.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      {
        $set: { status: ProductStatus.Inactive },
        $currentDate: { updated_at: true },
      },
      {
        returnDocument: "after",
      }
    );
    return newProduct;
  }

  async getProductById(productId: string) {
    const product = await databaseService.products.findOne({
      _id: new ObjectId(productId),
    });
    if (!product)
      throw new ErrorWithStatus("Product not found", HTTP_STATUS.NOT_FOUND);
    return product;
  }

  async getAllProducts() {
    const products = await databaseService.products.find().toArray();

    return products;
  }
}

const productServices = new ProductServices();
export default productServices;
