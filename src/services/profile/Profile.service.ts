import { Request, Response } from "express";
import { CreateProfile, DeleteProfile, ProfileDetail, UpdateProfile } from "../../controllers/users/Profile.controller";

export class ProfileService {
  async CreateProfileService(req: Request, res: Response) {
    try {
      const { fullName, bio, dateOfBirth, avatar, socials } = req.body;
      const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
      const createProfile = await CreateProfile({
        fullName,
        bio,
        dateOfBirth,
        avatar,
        socials
      }, token);
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
  async ProfileDetail(req: Request, res: Response) {
    try {
      const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
      const { id } = req.body;
      const viewProfile = await ProfileDetail(id, token);
      return res.status(viewProfile.statusCode).json({
        message: viewProfile.message,
        data: viewProfile.data
      })
    } 
    catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        data: {},
      })
    }
  }
}
