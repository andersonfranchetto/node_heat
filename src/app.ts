import "dotenv/config";
import express from 'express';
import { router } from "./routes";

const app = express();

app.use(express.json({ limit: '2mb' }));

app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

export default app;
