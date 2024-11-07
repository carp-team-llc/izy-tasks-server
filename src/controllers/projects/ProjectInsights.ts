import prisma from "../../utils/connection/connection";

export interface ProjectInsight {
  projectId?: string;
}

const TopInsight = async ({ projectId }: ProjectInsight) => {
  try {

    const ProjectTask = await prisma.tasks.findMany({
      where: {
        AND: [
          {
            projectId,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        statusName: true,
        statusColor: true,
        estimatetime: true,
        updatedAt: true,
      },
    });

    const projectInfo = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        deadline: true,
        timeworking: true,
        totalEstimate: true,
      },
    })

    const totalTime = ProjectTask.reduce((acc, task) => acc + Number(task.estimatetime), 0);
    const completedTime = ProjectTask
      .filter(task => task.status === 'completed')
      .reduce((acc, task) => acc + Number(task.estimatetime), 0);
    const timeSpent = totalTime - completedTime;

    const totalTask = ProjectTask.length;
    const totalCompletedTask = ProjectTask.filter(task => task.status === 'completed').length;
    const taskSpent = totalTask - totalCompletedTask;

    const totalLateTask = ProjectTask.filter(task => task.status === 'late').length;
    const totalCancelTask = ProjectTask.filter(task => task.status === 'late').length;

    return {
      statusCode: 201,
      message: "Top insights retrieved successfully",
      data: {
        totalTime,
        timeSpent,
        totalTask,
        taskSpent,
        totalCompletedTask,
        totalLateTask,
        totalCancelTask,
        projectDeadline: projectInfo.deadline,
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed to retrieve top insights",
      data: null,
    };
  }
};

export { TopInsight };
