import express from 'express';
// import { protect } from '../middleware/authMiddleware.js';
import {
    getCodeBlocks,
    createCodeBlock,
    getCodeBlockExists,
    getCodeBlockById,
    getCodeBlockByUserCategory,
    deleteCodeBlockByUserId,
    editCodeBlock
} from '../../controllers/codeBlockController';
const router = express.Router();

router.get('/', getCodeBlocks);
router.post('/category', getCodeBlockByUserCategory);
router.post('/exists', getCodeBlockExists);
router.get('/:_id/', getCodeBlockById);
router.delete("/:_id", deleteCodeBlockByUserId);
router.post('/', createCodeBlock);
router.put("/:_id", editCodeBlock)

export default router;