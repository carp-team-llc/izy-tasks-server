import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";
import type { Comments } from "./dto/comments.dto";

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

    const userInfo = LoadUserInfo(token)
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
    })
    return {
      statusCode: 200,
      message: "Comment updated successfully",
      data: updateComment,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Failed to update a comment" };
  }
}

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
}

export { CreateComments, UpdateComment, DeleteComment }