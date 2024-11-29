import schedule from "node-schedule";
import prisma from "../../../utils/connection/connection";
import { EnumData } from "../../../constant/enumData";
import moment from "moment-timezone";

const TaskMonitor = async () => {
  const CheckExpirationsTask = async () => {
    try {
      const today = new Date();
      const tasks = await prisma.tasks.findMany({
        where: {
          expirationDate: {
            lt: today,
          },
          NOT: {
            status: {
              in: [
                EnumData.StatusType.Late.code,
                EnumData.StatusType.Cancel.code,
                EnumData.StatusType.Completed.code,
              ],
            },
          },
        },
      });
      const updatePromises = tasks.map(async (task) => {
        await prisma.tasks.update({
          where: { id: task.id },
          data: {
            isExpiration: true,
            status: EnumData.StatusType.Late.code,
            statusColor: EnumData.StatusType.Late.color,
            statusName: EnumData.StatusType.Late.name,
          },
        });
      });
      await Promise.all(updatePromises);
      const now = moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
      console.log(
        `[${now}] - Checked task expirations. Updated ${tasks.length} tasks.`
      );
    } catch (error) {
      console.error("Error checking task expirations:", error);
    }
  };

  schedule.scheduleJob("0 0 * * *", () => {
    console.log("Running Check expirationDate...");
    CheckExpirationsTask();
  });
};

export default TaskMonitor;