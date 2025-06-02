import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";
import type { Comments } from "./dto/comments.dto";
import { ProjectMemberInfo } from "../projects/utils/ProjectMemberInfo";

const DetailComments = async (taskId: string, token: string) => {
  const projectMemberInfo = new ProjectMemberInfo();
  try {
    if (!taskId) {
      return { statusCode: 400, message: "Task ID is required", data: null };
    }

    const userInfo = LoadUserInfo(token);

    const findTask = await prisma.tasks.findFirst({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        projectId: true,
        authorId: true,
        employeeId: true,
      },
    });

    if (!findTask) {
      return { statusCode: 404, message: "Task not found", data: null };
    }

    const isRelatedToTask = [findTask.authorId, findTask.employeeId].includes(
      userInfo.userId
    );

    if (!findTask?.projectId) {
      if (!isRelatedToTask) {
        return {
          statusCode: 403,
          message:
            "Forbidden: You are not authorized to view this task's comments",
          data: null,
        };
      }
    } else {
      const isProjectMember = await projectMemberInfo.IsProjectMember(
        findTask.projectId,
        token
      );
      if (!isProjectMember?.isMember) {
        return {
          statusCode: 403,
          message: "Forbidden: You are not a member of this project",
          data: null,
        };
      }
    }

    if (!isRelatedToTask) {
      return {
        statusCode: 403,
        message:
          "Forbidden: You are not authorized to view this task's comments",
        data: null,
      };
    }

    const comments = await prisma.comments.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            createdAt: true,
            profile: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: "Comments retrieved successfully",
      data: comments,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Failed to retrieve comments",
      data: null,
    };
  }
};

const CreateComments = async ({ content, taskId }: Comments, token: string) => {
  try {
    const errors: string[] = [];
    if (!content) errors.push("content");
    if (!taskId) errors.push("taskId");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: null,
      };
    }

    const userInfo = LoadUserInfo(token);
    const comments = await prisma.comments.create({
      data: {
        content,
        taskId,
        userId: userInfo.userId,
      },
      include: {
        task: true,
        user: true,
      },
    });

    return {
      statusCode: 201,
      message: "Comment created successfully",
      data: comments,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Failed to create a comment",
    };
  }
};

const UpdateComment = async (id: string, content: string) => {
  try {
    if (!id) {
      return { statusCode: 400, message: "Comment ID is required for update" };
    }
    if (!content) {
      return { statusCode: 400, message: "Content is required for update" };
    }
    const updateComment = await prisma.comments.update({
      where: { id },
      data: { content },
    });
    return {
      statusCode: 200,
      message: "Comment updated successfully",
      data: updateComment,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Failed to update a comment" };
  }
};

const DeleteComment = async (id: string) => {
  try {
    if (!id) {
      return { statusCode: 400, message: "Comment ID is required for delete" };
    }
    await prisma.comments.delete({ where: { id } });
    return { statusCode: 200, message: "Comment deleted successfully" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Failed to delete a comment" };
  }
};

export { DetailComments, CreateComments, UpdateComment, DeleteComment };
