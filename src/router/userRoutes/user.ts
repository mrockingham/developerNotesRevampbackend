import express, { Request, Response } from "express"
import { forgotPasswordLink, getUserProfile, registerUser, resetPassword, verifyUser } from "../../controllers/userController"
// import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()


router.get("/test", (req: Request, res: Response) => {
    res.json('get called')
})
router.post('/', registerUser)
// router.get("/verify/:token", verifyUser)
// router.post("/profile/", getUserProfile)
// router.get("/verify/:token", verifyUser, (req, res) => {
//     res.render("verified", { title: "DeverNote" })
// })
// router.post("/verifypw", forgotPasswordLink, (req, res) => {
//     res.render("verifiedPassword", { title: "DeverNote" })
// })

// router.post("/reset", resetPassword)


export default router;
