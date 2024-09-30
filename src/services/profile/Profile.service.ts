import { Request, Response } from "express";
import { CreateProfile } from "../../controllers/users/UserManager";
import { DeleteProfile, ProfileDetail, UpdateProfile } from "../../controllers/users/Profile.controller";

export class ProfileService {
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
  async UpdateProfileService(req: Request, res: Response) {
    try {
      const { fullName, bio, dateOfBirth, avatar, user, id } = req.body;
      const updateProfile = await UpdateProfile({
        id,
        fullName,
        bio,
        dateOfBirth,
        avatar,
        user,
      });
      return res.status(updateProfile.statusCode).json({
        message: updateProfile.message,
        data: updateProfile.data
      })
    } catch {
      return res.status(500).send({
        message: "Internal server error!",
        data: [],
      });
    }
  }
  async DeleteProfileService(req: Request, res: Response) {
    try {
      const { fullName, bio, dateOfBirth, avatar, user, id } = req.body;
      const deleteProfile = await DeleteProfile({
        id,
        fullName,
        bio,
        dateOfBirth,
        avatar,
        user,
      });
      return res.status(deleteProfile.statusCode).json({
        message: deleteProfile.message,
        data: deleteProfile.data
      })
    } catch {
      return res.status(500).send({
        message: "Internal server error!",
        data: [],
      });
    }
  }
  async ProfileDetailService(req: Request, res: Response) {
    try {
      const { fullName, bio, dateOfBirth, avatar, user, id } = req.body;
      const profileDetail = await  ProfileDetail({
        id,
        fullName,
        bio,
        dateOfBirth,
        avatar,
        user,
      });
      return res.status(profileDetail.statusCode).json({
        message: profileDetail.message,
        data: profileDetail.data
      })
    } catch {
      return res.status(500).send({
        message: "Internal server error!",
        data: [],
      });
    }
  }
}
