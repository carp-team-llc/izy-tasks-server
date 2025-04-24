import { Request, Response } from "express";
import { CreateProfile, ProfileDetail } from "../../controllers/users/Profile.controller";
import { AuthGuard } from "src/utils/middleware/authentication/AuthGuard";

export class UserService {

  async CreateProfileService(req: Request, res: Response) {
    try {
      const { fullName, bio, dateOfBirth, avatar, user, socials, gender } = req.body;
      const token = AuthGuard(req);
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
