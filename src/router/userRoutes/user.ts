import express, { Request, Response } from "express"
import { forgotPasswordLink, getUserProfile, registerUser, resetPassword, verifyUser, loginUser } from "../../controllers/userController"
// import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()


router.get("/test", (req: Request, res: Response) => {
    res.json('get called')
})
router.post('/', registerUser)
router.get("/verify/:token", verifyUser)
// router.post("/profile/", getUserProfile)
// router.get("/verify/:token", verifyUser, (req, res) => {
//     res.redirect("http://localhost:3001/verify")
// })
router.post("/login", loginUser)
// })

// router.post("/reset", resetPassword)


export default router;
