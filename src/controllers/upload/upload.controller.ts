import path from "path";
import { v4 as uuidv4 } from "uuid";
import { bucket } from "../../../firebaseAdmin";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const UploadFileToCloud = async (file: any) => {
  if (!file) {
    console.error("No file provided.");
    return {
      statusCode: 403,
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

  const uniqueFileName = `${uuidv4()}${fileExtension}`;

  return new Promise<{
    statusCode: number;
    message: string;
    data: string | {};
  }>((resolve, reject) => {
    try {
      const blob = bucket.file(`${folderPath}${uniqueFileName}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        reject({
          statusCode: 500,
          message: "Upload failed!",
          data: {},
        });
      });

      blobStream.on("finish", async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve({
          statusCode: 201,
          data: publicUrl,
          message: "Upload successfully!",
        });
      });

      blobStream.end(file.buffer);
    } catch (err) {
      reject({
        statusCode: 500,
        message: "Internal Server Error!",
        data: {},
      });
    }
  });
};

export default UploadFileToCloud;