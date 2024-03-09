import express from 'express';
import user from './userRoutes/user'
import theme from './themeRoutes/themeRoutes'
import codeBlockRoutes from './codeBlockRoutes/codeBlockRoutes';

const app = express();

const router = express.Router();

router.use("/users", user)
router.use('/theme', theme)
router.use('/codeblock', codeBlockRoutes);


export default router;