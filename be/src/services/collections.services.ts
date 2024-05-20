import Collection from "~/models/schemas/Collection.schema";
import databaseService from "./database.services";
import { ObjectId } from "mongodb";
import { CollectionStatus } from "~/constants/enum";
import { UpdateCollectionReqBody } from "~/models/requests/Collections.requests";
import { COLLECTIONS_MESSAGES } from "~/constants/messages";

class CollectionService {
  async addCollection(name: string) {
    const collection_id = new ObjectId();
    const newCollection = new Collection({
      _id: collection_id,
      name,
      status: CollectionStatus.Active,
    });
    await databaseService.collections.insertOne(newCollection);
    console.log(newCollection);

    return newCollection;
  }

  async checkCollectionExisted(name: string) {
    const collection = await databaseService.collections.findOne({ name });
    return Boolean(collection);
  }

  async getAllCollections() {
    const collections = await databaseService.collections.find().toArray();
    return collections;
  }

  async updateCollection(collection_id: string, body: UpdateCollectionReqBody) {
    const collection = await databaseService.collections.findOneAndUpdate(
      { _id: new ObjectId(collection_id) },
      {
        $set: {
          ...body,
        },
        $currentDate: { updated_at: true },
      },
      {
        returnDocument: "after",
      }
    );
    return collection;
  }

  async deleteCollection(collection_id: string) {
    const collection = await databaseService.collections.findOne({
      _id: new ObjectId(collection_id),
    });

    if (collection === null) {
      return { message: COLLECTIONS_MESSAGES.COLLECTION_NOT_FOUND };
    }
    await databaseService.collections.deleteOne(collection);
    return {
      message: COLLECTIONS_MESSAGES.DELETE_COLLECTION_SUCCESS,
    };
  }
}

const collectionsService = new CollectionService();
export default collectionsService;
