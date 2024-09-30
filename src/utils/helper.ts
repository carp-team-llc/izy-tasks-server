import { EnumData } from "../constant/enumData";

const Helper = {
  HandleStatus({status}) {
    const statusInfo = EnumData.StatusType[status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()];

  if (statusInfo) {
      return {
          name: statusInfo.name,
          engName: statusInfo.engName,
          color: statusInfo.color
      };
  }

  return null;
  }
}

export default Helper;