import express from 'express';
import { createItem, getItems, deleteItem, updateItem } from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createItem);
router.get('/', protect, getItems);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

export default router;
