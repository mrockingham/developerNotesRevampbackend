import express, { Request, Response } from 'express'
import { getTheme, addTheme } from '../../controllers/themeController'


const router = express.Router()




// router.get("/", (req: Request, res: Response) => {
//     res.json('get called')
// })

router.get("/:name", getTheme)
router.post('/new', addTheme)


export default router;