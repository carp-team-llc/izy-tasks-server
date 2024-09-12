import { Request, Response } from "express";
import { CreateProfile } from "../../controllers/users/UserManager";

export class UserService {
  async CreateProfileService(req: Request, res: Response) {
    try {
      const { fullName, bio, dateOfBirth, avatar, user } = req.body;
      const createProfile = await CreateProfile({
        fullName,
        bio,
        dateOfBirth,
        avatar,
        user,
      });
      return res.status(createProfile.statusCode).json({
        message: createProfile.message,
        data: createProfile.data
      })
    } catch {
      return res.status(500).send({
        message: "Internal server error!",
        data: [],
      });
    }
  }
}
