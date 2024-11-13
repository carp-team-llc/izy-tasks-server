import { Request, Response } from "express";
import { CreateProfile } from "../../controllers/users/Profile.controller";

export class UserService {
  async CreateProfileService(req: Request, res: Response) {
    try {
      const { fullName, bio, dateOfBirth, avatar, user, socials, gender } = req.body;
      const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
      const createProfile = await CreateProfile({
        fullName,
        bio,
        dateOfBirth,
        avatar,
        user,
        gender,
        socials
      }, token);
      return res.status(createProfile.statusCode).json({
        message: createProfile.message,
        data: createProfile.data
      })
    } catch {
      return res.status(500).send({
        message: "Internal server error! cc",
        data: [],
      });
    }
  }
}
