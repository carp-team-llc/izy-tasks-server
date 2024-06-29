import express from 'express';
import initApi from './src/modules/initApi';

const app = express();
const PORT = process.env.PORT || 3000;

initApi(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});