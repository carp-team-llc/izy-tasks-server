import { TeamDTO, type pagination } from "./dto/team.dto";
import prisma from "../../utils/connection/connection";
import { EnumData } from "../../constant/enumData";
import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";

const TeamPagination = async (
  { where, skip, take }: pagination,
  token: string
) => {
  try {
    const userInfo = LoadUserInfo(token); // load user info from token
    const teams = await prisma.team.findMany({ // get all teams that are member of the user
      where: {
        member: {
          some: {
            userId: userInfo?.userId,
          },
        },
        AND: where,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        address: true,
        phonenumber: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      },
      skip,
      take,
    });
    return {
      statusCode: 201,
      message: "success!",
      data: teams,
    };
  } catch (err) {
    console.error("Error: \n", err);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};

const DetailTeam = async ({ id }, token: string) => {
  try {
    if (!id) {
      return {
        statusCode: 400,
        message: "Missing required parameter: id",
      };
    }
    const userInfo = LoadUserInfo(token);
    const detail = await prisma.team.findFirst({
      where: {
        member: {
          some: {
            userId: userInfo?.userId,
          },
        },
        AND: {
          id: id,
        },
      },
      select: {
        id: true,
        name: true,
        bio: true,
        address: true,
        phonenumber: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        member: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              }
            },
            role: true,
            roleCode: true,
            roleName: true,
            roleEngName: true,
            permission: true,
            joinedAt: true,
          },
        },
      },
    });
    return {
      statusCode: 201,
      data: detail,
    };
  } catch (err) {
    console.error("Error: \n", err);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};

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

    let addedMembers = [];
    if (member && member.length > 0) {
      const teamMembersData = member.map((teamMember) => ({
        userId: teamMember.userId,
        teamId: newTeam.id,
        role: teamMember.role,
        roleCode: EnumData.TeamRole[teamMember.role].code,
        roleName: EnumData.TeamRole[teamMember.role].name,
        roleEngName: EnumData.TeamRole[teamMember.role].engName,
        permission: EnumData.TeamRole[teamMember.role].PERMISSION,
      }));

      await prisma.teamMember.createMany({
        data: teamMembersData,
      });

      const userIds = member.map((m) => m.userId);
      const foundMembers = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      addedMembers = foundMembers;
    }

    return {
      statusCode: 201,
      message: "Team created successfully",
      data: {
        ...newTeam,
        members: addedMembers,
      },
    };
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
      },
    });

    let addedMembers = [];
    if (member && member.length > 0) {
      const teamMembersData = member.map((teamMember) => ({
        userId: teamMember.userId,
        teamId: updateTeam.id,
        role: teamMember.role,
        roleCode: EnumData.TeamRole[teamMember.role].code,
        roleName: EnumData.TeamRole[teamMember.role].name,
        roleEngName: EnumData.TeamRole[teamMember.role].engName,
        permission: EnumData.TeamRole[teamMember.role].PERMISSION,
      }));

      await prisma.teamMember.createMany({
        data: teamMembersData,
      });

      const userIds = member.map((m) => m.userId);
      const foundMembers = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      addedMembers = foundMembers;
    }

    return {
      statusCode: 200,
      message: "Team updated successfully",
      data: {
        ...updateTeam,
        members: addedMembers,
      },
    };
  } catch {
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};

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
      where: { id },
    });
    return {
      statusCode: 200,
      messge: "Delete team successfully",
      data: deleteTeam,
    };
  } catch {
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};

export { TeamPagination, CreateTeam, UpdateTeam, DeleteTeam, DetailTeam };
