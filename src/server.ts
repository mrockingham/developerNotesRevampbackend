import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/config';
import cors from 'cors';
import helmet from 'helmet';
import Routes from './router/index';
dotenv.config();

const server = express();
const port = process.env.PORT || 5001;

connectDB();

server.use(express.json());
server.use(express.urlencoded({ extended: true }))
server.use(express.static("public"))
server.use(cors());
server.use(helmet());


server.listen(port, () =>
    console.log(`\n** Server is listening on port ${port} **\n`)
);
server.use('/app', Routes);
server.get('/', (req, res) => {
    res.status(200).json({ api: 'UP' });
});