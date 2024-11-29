import express from "express";
import initApi from "./src/modules/initApi";
import { connectRedis } from "./src/utils/configs/redis.client";
import Monitor from "./src/utils/monitor/Monitor";

const app = express();
const PORT = process.env.PORT || 4080;

initApi(app);
Monitor();

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.IP_HOST}`);
});
