import { LABOR_COST } from "./../constants/constant";
import { CreateProductReqBody } from "~/models/requests/Products.requests";
import databaseService from "./database.services";
import goldPricesServices from "./gold_prices.services";
import { ONE_TEIL_GOLD } from "~/constants/constant";
import { ObjectId } from "mongodb";
import { ProductStatus } from "~/constants/enum";
import { ErrorWithStatus } from "~/models/Errors";
import HTTP_STATUS from "~/constants/httpStatus";
import mediasService from "./medias.services";
import { Request } from "express";
import { PRODUCTS_MESSAGES } from "~/constants/messages";
import { deleteFileFromS3 } from "~/utils/s3";

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
    const numbers = "0123456789";
    let result = "PD"; // Start with PD
    const numbersLength = numbers.length;
    for (let i = 0; i < 6; i++) {
      // Generate 6 random numeric characters
      result += numbers.charAt(Math.floor(Math.random() * numbersLength));
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
      image: "",
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

  async addImageToProduct(product_id: string, req: Request) {
    const product = await databaseService.products.findOne({
      _id: new ObjectId(product_id),
    });
    if (!product) {
      throw new ErrorWithStatus(
        PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const urls = await mediasService.uploadImage(req);
    const images = urls.map((url) => ({
      _id: new ObjectId(),
      url: url.url,
    }));

    // Add the new images to the product
    const result = await databaseService.products.findOneAndUpdate(
      { _id: new ObjectId(product_id) },
      { $set: { image_url: images[0]?.url } },
      { returnDocument: "after" }
    );

    return result;
  }

  async deleteProductImage(product_id: string, url: string) {
    const product = await databaseService.products.findOne({
      _id: new ObjectId(product_id),
    });
    if (!product) {
      throw new ErrorWithStatus(
        PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const filename = url.split("/").pop();
    await deleteFileFromS3(filename as string);
    // Remove the image URL from the product
    const result = await databaseService.products.findOneAndUpdate(
      { _id: new ObjectId(product_id) },
      { $set: { image_url: "" } },
      { returnDocument: "after" }
    );

    return result;
  }
}

const productServices = new ProductServices();
export default productServices;
