import prisma from "../../utils/connection/connection";
import type { profileDto } from "./dto/user.dto";

const CreateProfile = async ({
  fullName,
  bio,
  dateOfBirth,
  avatar,
  user,
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
          connect: { id: user }
        }
      }
    })

    return {
      statusCode: 201,
      message: "Create Profile successfully!",
      data: createProfile
    }

  } catch (err) {
    console.error("Error in create profile: ", err);
    return {
      statusCode: 500,
      message: "Bad request!",
      data: [],
    };
  }
};

export { CreateProfile }