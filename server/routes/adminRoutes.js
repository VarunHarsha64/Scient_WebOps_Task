import express from 'express';
import isAdmin from '../middleware/adminMiddleware.js'; 

const router = express.Router();

router.get('/admin-only', isAdmin, (req, res) => {
  res.send('This is an admin-only route');
});

export default router;
