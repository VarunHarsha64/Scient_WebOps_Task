import express from "express";
import {
  registerUser, loginUser, getUserProfile, getMySlots
} from "../controllers/userController.js";
import authenticate from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", isAdmin, registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticate, getUserProfile);
router.get('/my-slots',authenticate, getMySlots)

export default router;
