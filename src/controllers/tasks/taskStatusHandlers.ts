import { EnumData } from "../../constant/enumData";
import prisma from "../../utils/connection/connection";

const CheckTaskId = ({ id }) => {
  if (!id) {
    return { statusCode: 400, message: "Task ID is required for Completed!"}
  }
}

const UpdateTaskStatus = async ({ id, statusKey }) => {

  CheckTaskId(id);

  const statusInfo = EnumData.StatusType[statusKey];
  if (!statusInfo) {
    return { statusCode: 400, message: "Invalid status key!" };
  }

  try {

    try {
      const task = await prisma.tasks.findUnique({
        where: { id },
      });
  
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

    return { statusCode: 200, message: `${statusInfo.name} Task!`, task: updatedTask };
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

const LateTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'Late' });
};

const NewTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'New' });
};

const PendingTask = async ({ id }) => {
  return await UpdateTaskStatus({ id, statusKey: 'Pending' });
};

export { CompletedTask, CancelTask, PendingTask, NewTask, LateTask };
