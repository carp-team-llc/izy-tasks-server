
import prisma from "../../utils/connection/connection";

const RoleList = async () => {
  try {
    const getUserPermission = await prisma.projectMember.findFirst({
      where: { permission: "HIGH" }
    })
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Internal server error!"
    }
  }
}

const SetModeratorRole = async () => {
  
}

export { SetModeratorRole }