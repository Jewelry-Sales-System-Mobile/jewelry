// import { config } from "dotenv";
// import { S3 } from "@aws-sdk/client-s3";
// import { Upload } from "@aws-sdk/lib-storage";
// import fs from "fs";
// import path from "path";
// import { envConfig } from "~/constants/config";

// config();
// // Set the Region
// const s3 = new S3({
//   region: envConfig.awsRegion,
//   credentials: {
//     secretAccessKey: envConfig.awsSecrectAccessKey,
//     accessKeyId: envConfig.awsAccessKeyId,
//   },
// });

// // const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// // Call S3 to list the buckets
// // s3.listBuckets(function (err, data) {
// //   if (err) {
// //     console.log("Error", err);
// //   } else {
// //     // console.log("Success", data.Buckets);
// //   }
// // });

// // D:\Project\Nodejs\twitter-be\uploads\fdcfa2e4133805970e4741e00.jpg
// // const file = fs.readFileSync(
// //   path.resolve("uploads/fdcfa2e4133805970e4741e00.jpg")
// // );

// export const uploadFileToS3 = ({
//   filename,
//   filepath,
//   contentType,
// }: {
//   filename: string;
//   filepath: string;
//   contentType: string;
// }) => {
//   const parallelUploads3 = new Upload({
//     client: s3,
//     params: {
//       Bucket: envConfig.awsBucketName,
//       Key: filename,
//       Body: fs.readFileSync(path.resolve(filepath)),
//       ContentType: contentType,
//     },

//     // optional tags
//     tags: [
//       /*...*/
//     ],

//     // additional optional fields show default values below:

//     // (optional) concurrency configuration
//     queueSize: 4,

//     // (optional) size of each part, in bytes, at least 5MB
//     partSize: 1024 * 1024 * 5,

//     // (optional) when true, do not automatically call AbortMultipartUpload when
//     // a multipart upload fails to complete. You should then manually handle
//     // the leftover parts.
//     leavePartsOnError: false,
//   });

//   return parallelUploads3.done();
// };

// export const deleteFileFromS3 = async (key: string) => {
//   const deleteParams = {
//     Key: key,
//     Bucket: envConfig.awsBucketName,
//   };
//   await s3.deleteObject(deleteParams);
// };
