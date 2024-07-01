import { Request } from "express";
import path from "path";
import sharp from "sharp";
import { UPLOAD_DIR } from "~/constants/dir";
import { getNameWithoutExtension, handleUploadImage } from "~/utils/file";
import fsPromise from "fs/promises";
import { config } from "dotenv";
import { uploadFileToS3 } from "~/utils/s3";
import { Media } from "~/models/schemas/Other.schema";
config();
class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req);

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameWithoutExtension(file.newFilename);
        const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`);
        await sharp(file.filepath).jpeg().toFile(newPath);
        const s3Res = await uploadFileToS3({
          filename: `${newName}.jpg`,
          filepath: newPath,
          contentType: "image/jpeg",
        });

        await Promise.all([
          fsPromise.unlink(file.filepath),
          fsPromise.unlink(newPath),
        ]);

        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/${newName}.jpg`
        //     : `http://localhost:${process.env.PORT}/static/${newName}.jpg`,
        //   type: MediaType.Image,
        // };
        return {
          url: s3Res.Location as string,
        };
      })
    );
    return result;
  }
}
const mediasService = new MediasService();
export default mediasService;
