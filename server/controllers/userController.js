import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Slot from "../models/slotModel.js";

export const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ message: "Username, password, and role are required" });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success:false ,message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({success:false , message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({success:false , message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({success:true , token });
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false , message: "Server error", error });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMySlots = async (req, res) => {
  const userId = req.user._id;
  try {
    const mySlots = await Slot.find({
      "bookedBy.user": userId,
    }).sort({ "bookedBy.bookingTime": -1 });

    res.status(200).json(mySlots);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error });
  }
};
