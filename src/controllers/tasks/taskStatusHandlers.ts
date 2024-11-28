import { EnumData } from "../../constant/enumData";
import prisma from "../../utils/connection/connection";

const UpdateTaskStatus = async ({ id, statusKey }) => {

  if (!id) {
    return { statusCode: 400, message: "Task ID is required for Completed!"}
  }

  const statusInfo = EnumData.StatusType[statusKey];
  if (!statusInfo) {
    return { statusCode: 400, message: "Invalid status key!" };
  }

  try {

    try {
      const task = await prisma.tasks.findUnique({
        where: { id },
      });

      var logStatus = task.statusName

      if (task.status === EnumData.StatusType.Cancel.code && statusKey !== 'New') {
        return { statusCode: 400, message: "Task is in 'Cancel' state and can only be changed back to 'New'." };
      }
  
      if (task.status === EnumData.StatusType.Completed.code && statusKey === 'Cancel') {
        return { statusCode: 400, message: "Task is in 'Completed' state and cannot be changed to 'Cancel'." };
      }
  
      if (task.status === statusInfo.code) {
        return { statusCode: 400, message: `Task is already in the '${statusInfo.code}' state and cannot be changed.` };
      }
    } catch {
      return { statusCode: 404, message: "ID not found!" };
    }

    const updatedTask = await prisma.tasks.update({
      where: { id },
      data: {
        status: statusInfo.code,
        statusName: statusInfo.name,
        statusColor: statusInfo.color,
      },
    });

    if (updatedTask) {
      await prisma.taskHistory.create({
        data: {
          taskId: updatedTask.id,
          action: `Update status from: '${logStatus}' to: '${updatedTask.statusName}' from task: '${id}'`,
          changes: {
              title: updatedTask.name,
              body: updatedTask.body,
              status: updatedTask.status,
              statusColor: updatedTask.statusColor,
              statusName: updatedTask.statusName,
              author: updatedTask.authorId,
              expirationDate: updatedTask.expirationDate,
              images: updatedTask.images,
              tags: updatedTask.tags,
              project: updatedTask.projectId,
              team: updatedTask.team,
              employee: updatedTask.employeeId,
          }
      }
      })
    }

    return { statusCode: 200, message: `Update status to: ${statusInfo.name}`, task: updatedTask };
  } catch (error) {
    console.error(`Error updating task status to ${statusInfo.name}`, error);
    return { statusCode: 500, message: "Internal Server Error!" };
  }
};

const CancelTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'Cancel' });
};

const CompletedTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'Completed' });
};

const DoingTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'Doing' });
};

const LateTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'Late' });
};

const NewTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'New' });
};

const PendingTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'Pending' });
};

export { UpdateTaskStatus, CompletedTask, CancelTask, DoingTask, PendingTask, NewTask, LateTask };
