import prisma from "../../utils/connection/connection";
import type { SprintDTO } from "./sprint.dto";

const CreateSprint = async (Variables: SprintDTO) => {
  try {
    let errors: string[] = [];
    if (!Variables.name) errors.push("Name");
    if (!Variables.effectiveDate) errors.push("Effective");
    if (!Variables.expiryDate) errors.push("Expiry");

    if (errors.length > 0) {
      return {
        statusCode: 401,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [],
      };
    }

    const createSprint = await prisma.sprint.create({
      data: {
        id: Variables.id,
        name: Variables.name,
        effectiveDate: Variables.effectiveDate,
        expiryDate: Variables.expiryDate,
        createdAt: Variables.createdAt,
        updatedAt: Variables.updatedAt,
      },
    });

    return {
      statusCode: 201,
      message: "Create sprint success!",
      data: createSprint
    }

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Bad request!",
    };
  }
};

export { CreateSprint }
