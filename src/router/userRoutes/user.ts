import express from "express"
import { registerUser, getUser } from "../../controllers/userController"

const router = express.Router()
router.post('/', registerUser)
router.get('/', getUser);
// router.get('/', (req, res) => {
//     res.status(200).json({ api: 'app routes up' });
// });

export default router;