import path from "path";
import { bucket } from "../../../firebaseAdmin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const UploadFileToCloud = async (file: any) => {
  if (!file) {
    console.error("No file provided.");
    return {
      statusCode: 401,
      message: "Choose file before upload!",
      data: {},
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    console.error("File exceeds size limit:", file.size);
    return {
      statusCode: 413,
      message: "File size exceeds the 5MB limit.",
      data: {},
    };
  }

  const fileExtension = path.extname(file.originalname).toLowerCase();
  let folderPath = "document/";
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

  if (imageExtensions.includes(fileExtension)) {
    folderPath = "images/";
  }

  console.log("Starting upload to folder:", folderPath);

  return new Promise<{
    statusCode: number;
    message: string;
    data: string | {};
  }>((resolve, reject) => {
    try {
      const blob = bucket.file(`${folderPath}${file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        console.error("Error uploading file:", err);
        reject({
          statusCode: 500,
          message: "Upload failed!",
          data: {},
        });
      });

      blobStream.on("finish", async () => {
        await blob.makePublic(); // public file
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        console.log("Upload successful, public URL:", publicUrl);
        resolve({
          statusCode: 201,
          data: publicUrl,
          message: "Upload successfully!",
        });
      });

      // Start the upload stream
      blobStream.end(file.buffer);
    } catch (err) {
      console.error("Internal error during upload:", err);
      reject({
        statusCode: 500,
        message: "Internal Server Error!",
        data: {},
      });
    }
  });
};

export default UploadFileToCloud;