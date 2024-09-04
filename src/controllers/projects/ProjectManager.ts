import { ProjectDto, type Variables } from "./dto/Project.dto";
import prisma from "../../utils/connection/connection";

const ProjectPanigation = async (variable: Variables) => {
  const { where, skip, take } = variable;
  try {
    const project = await prisma.project.findMany({
      where,
      skip,
      take,
    });
    const totalTasks = await prisma.project.count({ where });
    const totalPages = Math.ceil(totalTasks / take);
    return {
      statusCode: 201,
      data: {
        project: project,
        currentPage: Math.ceil(skip / take) + 1,
        totalTasks,
        totalPages,
      },
    };
  } catch (err) {
    console.log(err)
    return { statusCode: 500, message: "Bad request!" };
  }
};

const CreateProject = async ({
  name,
  description,
  createdAt,
  member,
  tasks,
  avatar,
  deadline,
}: ProjectDto) => {
  try {
    const errors: string[] = [];
    if (!name) errors.push("name");
    if (!deadline) errors.push("deadline");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }

    const newProject = await prisma.project.create({
      data: {
        name: name,
        description: description,
        createdAt,
        tasks: tasks
          ? { connect: tasks.map((taskId) => ({ id: taskId })) }
          : undefined,
        avatar: avatar,
        deadline: deadline,
      },
    });

    return {
      statusCode: 200,
      message: `Project "${name}" created successfully`,
      data: newProject
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

const UpdateProject = async ({
  id,
  name,
  description,
  createdAt,
  member,
  tasks,
  avatar,
  deadline,
}: ProjectDto) => {
  try {

    const updateProject = await prisma.project.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
        createdAt,
        tasks: tasks
          ? { connect: tasks.map((taskId) => ({ id: taskId })) }
          : undefined,
        avatar: avatar,
        deadline: deadline,
      },
    });

    return { 
      statusCode: 200, 
      message: `Update project: '${name}'` ,
      data: updateProject
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

const DeleteProject = async (id) => {
  try {

    if (!id) {
      return { statusCode: 400, message: "Project ID is required for delete" };
    }

    const deleteProject = await prisma.project.delete({
      where: { id: id },
    });

    return { 
      statusCode: 200, 
      message: `Project '${id}' has been delete!`,
      data: deleteProject
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

export { ProjectPanigation, CreateProject, UpdateProject, DeleteProject };
