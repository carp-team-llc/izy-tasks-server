import { EnumData } from "../../constant/enumData";

const LoadStatusList = () => {
  try {
    const StatusList = EnumData.StatusType;
    return {
      statusCode: 201,
      StatusList: StatusList
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Bad request!",
    };
  }
};

const LoadPriority = () => {
  try {
    const PriorityList = EnumData.PriorityType;
    return {
      statusCode: 201,
      PriorityList: PriorityList
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Bad request!",
    };
  }
}

const LoadProjecRole = () => {
  try {
    const ProjectRole = EnumData.ProjectRole;
    return {
      statusCode: 201,
      ProjectRole: ProjectRole
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Bad request!",
    };
  }
}

export { LoadStatusList, LoadPriority, LoadProjecRole }