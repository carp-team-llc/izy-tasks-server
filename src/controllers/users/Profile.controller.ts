import prisma from "../../utils/connection/connection";
import type { profileDto } from "./dto/user.dto";

const ProfileDetail = async ({ id }: profileDto) => {
  try {
    const errors: string[] = [];
    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [],
      };
    }

    const ProfileDetail = await prisma.profile.findFirst({
      where: { id },
    });

    return {
      statusCode: 201,
      message: "View Profile successfully!",
      data: ProfileDetail,
    };
  } catch (err) {
    console.error("Error in create profile: ", err);
    return {
      statusCode: 500,
      message: "Bad request!",
      data: [],
    };
  }
};

const CreateProfile = async ({
  fullName,
  bio,
  dateOfBirth,
  avatar,
  user,
  socials,
}: profileDto) => {
  try {
    const errors: string[] = [];
    if (!fullName) errors.push("name");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [],
      };
    }

    const createProfile = await prisma.profile.create({
      data: {
        fullName,
        bio,
        dateOfBirth,
        avatar,
        user: {
          connect: { id: user },
        },
        socials:
          socials?.length > 0
            ? {
                create: socials.map((social) => ({
                  platform: social.platform,
                  url: social.url,
                })),
              }
            : undefined,
      },
      include: {
        socials: true,
      },
    });

    return {
      statusCode: 201,
      message: "Create Profile successfully!",
      data: createProfile,
    };
  } catch (err) {
    console.error("Error in create profile: ", err);
    return {
      statusCode: 500,
      message: "Bad request!",
      data: [],
    };
  }
};

const UpdateProfile = async ({
  id,
  fullName,
  bio,
  dateOfBirth,
  avatar,
  user,
  socials,
}: profileDto) => {
  try {
    const errors: string[] = [];
    if (!fullName) errors.push("name");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [],
      };
    }

    const UpdateProfile = await prisma.profile.update({
      where: { id },
      data: {
        fullName,
        bio,
        dateOfBirth,
        avatar,
        user: {
          connect: { id: user },
        },
        socials:
          socials?.length > 0
            ? {
                create: socials.map((social) => ({
                  platform: social.platform,
                  url: social.url,
                })),
              }
            : undefined,
      },
      include: {
        socials: true,
      },
    });

    return {
      statusCode: 201,
      message: "Update Profile successfully!",
      data: UpdateProfile,
    };
  } catch (err) {
    console.error("Error in create profile: ", err);
    return {
      statusCode: 500,
      message: "Bad request!",
      data: [],
    };
  }
};

const DeleteProfile = async ({ id }: profileDto) => {
  try {
    const errors: string[] = [];

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [],
      };
    }

    const DeleteProfile = await prisma.profile.delete({
      where: { id },
    });

    return {
      statusCode: 201,
      message: "Delete Profile successfully!",
      data: DeleteProfile,
    };
  } catch (err) {
    console.error("Error in create profile: ", err);
    return {
      statusCode: 500,
      message: "Bad request!",
      data: [],
    };
  }
};

export { CreateProfile, ProfileDetail, UpdateProfile, DeleteProfile };
