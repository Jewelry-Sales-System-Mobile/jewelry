// ImageResizer.js

export default class ImageResizer {
  static async createResizedImage(
    uri,
    width,
    height,
    format,
    quality,
    rotation,
    outputPath,
    keepMeta,
    options
  ) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let targetWidth = width;
        let targetHeight = height;

        // Determine new dimensions to fit within the specified width and height
        if (img.width > img.height) {
          if (img.width > targetWidth) {
            targetHeight *= img.height / img.width;
            targetWidth = width;
          }
        } else {
          if (img.height > targetHeight) {
            targetWidth *= img.width / img.height;
            targetHeight = height;
          }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Get the resized image as data URL
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          format || "image/jpeg",
          quality || 0.92
        );
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = uri;
    });
  }
}
