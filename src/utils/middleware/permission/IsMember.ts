import prisma from "../../../utils/connection/connection"

const IsMember = async (projectId: string, userId: string) => {
  try {
    const isMember = await prisma.projectMember.findFirst({
      where: {
        AND: {
          projectId,
          userId
        }
      }
    })
    if (isMember) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return "Error checking if user is member of project"
  }
}

export default IsMember;