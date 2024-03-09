import express from 'express';
import { protect } from '../../middleWare/authMiddleware'
import {
    getCodeBlocks,
    createCodeBlock,
    getCodeBlockExists,
    getCodeBlockById,
    getCodeBlockByUserCategory,
    getAllCodeblocksInCategory,
    deleteCodeBlockByUserId,
    editCodeBlock,
    getCodeBlockByCreator
} from '../../controllers/codeBlockController';
const router = express.Router();

router.get('/', getCodeBlocks);
router.post('/category', protect, getCodeBlockByUserCategory);
router.post('/category/all', protect, getAllCodeblocksInCategory);

router.post('/exists', getCodeBlockExists);
router.post('/creator', protect, getCodeBlockByCreator)
router.post('/category/codeblock', protect, getCodeBlockById);
router.delete("/:_id", deleteCodeBlockByUserId);
router.post('/', createCodeBlock);
router.put("/:_id", editCodeBlock)

export default router;