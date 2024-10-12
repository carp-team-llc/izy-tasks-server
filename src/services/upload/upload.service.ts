
import { Response } from "express";
import { UploadFileToCloud, DeleteFileFromCloud } from "../../controllers/upload/upload.controller";
import type { MulterRequest } from "../../options/types/type";

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

  async DeleteFile(req: MulterRequest, res: Response) {
    try {
      const { url } = req.body;
      const result = await DeleteFileFromCloud(url);
      return res.status(result.statusCode).json({
        message: result.message,
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({message: "Internal server error!"})
    }
  }
}