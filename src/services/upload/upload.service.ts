
import { Request, Response } from "express";
import type { MulterRequest } from "../../options/types/type";
import UploadFileToCloud from "../../controllers/upload/upload.controller";

export class UploadFileService {
  async UploadFile(req: MulterRequest, res: Response) {
    try {
      const file = req.file;
      const uploadResult = await UploadFileToCloud(file);
      return res.status(uploadResult.statusCode).json({
        message: uploadResult.message,
        data: uploadResult.data
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({message: "Internal server error!"})
    }
  }
}