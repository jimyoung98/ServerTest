import express from "express";
import cors from "cors";
import morgan from "morgan";
import studentRouter from "./router/student.js"
import scoreRouter from "./router/score.js"
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { sequelize } from "./db/database.js";
// import {db} from './db/database.js'

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny')); // 사용자가 들어오면 로그를 찍어줌

app.use('/student',studentRouter)
app.use('/score', scoreRouter)

app.use((req, res) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.sendStatus(500);
});

sequelize.sync().then(() => {
    const server =app.listen(config.host.port);
initSocket(server);
})
