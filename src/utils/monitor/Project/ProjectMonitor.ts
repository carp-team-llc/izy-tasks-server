
// import Bull from "bull";
// import { EnumData } from "../../../constant/enumData";
// import redisClient from "../../../utils/configs/redis.client";
// import prisma from "../../../utils/connection/connection";
// import redisConfig from "../../configs/redis.config";

// const projectTaskQueue = new Bull("project-task", {
//   redis: redisConfig
// });

// projectTaskQueue.process(async (job) => {
//   const { projectId, status } = job.data;

//   try {
//     if (
//       status !== EnumData.StatusType.Late.code &&
//       status !== EnumData.StatusType.Completed.code
//     ) {
//       return { message: "Task status has not changed." };
//     }
//     const topInsight = await calculateTopInsgiht(projectId);
//     await redisClient.setEx(
//       `top-insight-${projectId}`,
//       3600,
//       JSON.stringify(topInsight)
//     );
//     return topInsight
//   } catch (error) {
//     console.error("Error processing task status change:", error);
//   }
// });

// const calculateTopInsgiht = async (projectId: string) => {
//   const ProjectTask = await prisma.tasks.findMany({
//     where: { projectId },
//   });
//   const totalTask = ProjectTask.length;

//   const totalCompletedTask = ProjectTask.filter(
//     (task) => task.status === "completed"
//   ).length;
//   const increaseCompleted = (totalCompletedTask * 100) / totalTask;

//   const totalLateTask = ProjectTask.filter(
//     (task) => task.status === "late"
//   ).length;
//   const increaseLate = (totalLateTask * 100) / totalTask;

//   return {
//     increaseCompleted,
//     increaseLate,
//     totalTask,
//     totalCompletedTask,
//     totalLateTask,
//   }
// }
