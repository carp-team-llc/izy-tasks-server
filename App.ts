import express from "express";
import initApi from "./src/modules/initApi";
import { connectRedis } from "./src/utils/configs/redis.client";

const app = express();
const PORT = process.env.PORT || 4080;

initApi(app);
// (async () => {
//     await connectRedis();
// })();

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.IP_HOST}`);
});
