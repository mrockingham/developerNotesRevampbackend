import express from 'express';
import user from './userRoutes/user'

const app = express();

const router = express.Router();

router.use("/users", user)


export default router;