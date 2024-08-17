import express from 'express';
import {
  getAllSlots,
  getFreeSlots,
  bookSlotById,
  cancelSlotById
} from '../controllers/slotController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getAllSlots);
router.get('/free', authenticate, getFreeSlots);
router.post('/book-slot', authenticate, bookSlotById);
router.post('/cancel-slot', authenticate, cancelSlotById);



export default router;