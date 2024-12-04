import express from "express";
import initApi from "./src/modules/initApi";
import Monitor from "./src/utils/monitor/monitor";

const app = express();
const PORT = process.env.PORT || 4080;

initApi(app);
Monitor();

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.IP_HOST}`);
});
