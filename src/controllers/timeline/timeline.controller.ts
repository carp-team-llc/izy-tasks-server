import prisma from "../../utils/connection/connection";

const ProjectTimline = async (id: string) => {
  try {
    if (!id) {
      return {
        statusCode: 400,
        message: "Missing required parameter: id",
      };
    }
    const projectInfo = await prisma.project.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        startTime: true,
        deadline: true,
        timeworking: true,
        totalEstimate: true,
      },
    });

    return {
      statusCode: 200,
      data: {
        startTime: projectInfo?.startTime,
        deadline: projectInfo?.deadline,
        timeworking: projectInfo?.timeworking,
        totalEstimate: projectInfo?.totalEstimate,
      },
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

const TeamTimline = async (id: string) => {
  try {
    if (!id) {
      return {
        statusCode: 400,
        message: "Missing required parameter: id",
      };
    }
    const teamInfo: any = await prisma.team.findFirst({
      where: { 
        id: id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        project: true,
      },
    });
    console.log(teamInfo.project);
    const projectInfo = teamInfo?.project.map((item: any) => {
      return {
        id: item?.id,
        name: item?.name,
        createdAt: item?.createdAt,
        updatedAt: item?.updatedAt,
        startTime: item?.startTime,
        deadline: item?.deadline,
        timeworking: item?.timeworking,
        totalEstimate: item?.totalEstimate,
      }
    })
    return {
      statusCode: 200,
      data: {
        id: teamInfo?.id,
        name: teamInfo?.name,
        createdAt: teamInfo?.createdAt,
        updatedAt: teamInfo?.updatedAt,
        project: projectInfo,
      }
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

export { ProjectTimline, TeamTimline };
