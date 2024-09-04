import { TeamDTO } from "./dto/team.dto";
import prisma from "../../utils/connection/connection";

const CreateTeam = async ({
  name,
  bio,
  address,
  phonenumber,
  email,
  avatar,
  member,
}: TeamDTO) => {
  try {
    const errors: string[] = [];
    if (!name) errors.push("Name is required");
    if (!address) errors.push("Address is required");
    if (!phonenumber) errors.push("Phonenumber is required");
    if (!email) errors.push("Email is required");
    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }

    const newTeam = await prisma.team.create({
      data: {
        name,
        bio,
        address,
        phonenumber,
        email,
        avatar,
      },
    });

    return {
      statusCode: 201,
      message: "Team created successfully",
      data: newTeam
    }
  } catch (err) {
    console.error("Error in Create Team with err: \n", err);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};

const UpdateTeam = async ({
  id,
  name,
  bio,
  address,
  phonenumber,
  email,
  avatar,
  member,
}: TeamDTO) => {
  try {
    const errors: string[] = [];
    if (!name) errors.push("Name is required");
    if (!address) errors.push("Address is required");
    if (!phonenumber) errors.push("Phonenumber is required");
    if (!email) errors.push("Email is required");
    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }
    const updateTeam = await prisma.team.update({
      where: { id },
      data: {
        name,
        bio,
        address,
        phonenumber,
        email,
        avatar,
      }
    })

    return {
      statusCode: 200,
      message: "Team updated successfully",
      data: updateTeam
    }
  } catch {
    return {
      statusCode: 500,
      message: "Internal Server Error",
    }
  }
}

const DeleteTeam = async ({ id }) => {
  try {
    const errors: string[] = [];
    if (!id) errors.push("Name is required");
    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }
    const deleteTeam = await prisma.team.delete({
      where: { id }
    })
    return {
      statusCode: 200,
      messge: "Delete team successfully",
      data: deleteTeam
    }
  } catch {
    return {
      statusCode: 500,
      message: "Internal Server Error",
    }
  }
}

export { CreateTeam, UpdateTeam, DeleteTeam }