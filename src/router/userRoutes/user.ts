import express, { Request, Response } from "express"
import { forgotPasswordLink, getUserProfile, registerUser, resetPassword, verifyUser, loginUser, registerProviderUser, loginProviderUser, updateOrAddTheme } from "../../controllers/userController"
// import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()


router.get("/test", (req: Request, res: Response) => {
    res.json('get called')
})
router.post('/', registerUser)
router.post('/provreg', registerProviderUser)
router.get("/verify/:token", verifyUser)
router.put('/update-theme', updateOrAddTheme);
// router.post("/profile/", getUserProfile)
// router.get("/verify/:token", verifyUser, (req, res) => {
//     res.redirect("http://localhost:3001/verify")
// })
router.post("/login", loginUser)
router.post("/loginprov", loginProviderUser)
// })

// router.post("/reset", resetPassword)


export default router;
