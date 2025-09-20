import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";

// ✅ Signup
export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });
    }
    const { name, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });
    }
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already taken" });
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Contact Admin (protected)
export const contactAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });
    }
    const { subject, message } = req.body;
    const user = req.user;

    // Configure transporter (use Gmail or SMTP from env)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      replyTo: user.email,
      subject: `[CraftConnect Contact] ${subject}`,
      text: `From: ${user.name} <${user.email}>
UserId: ${user._id}

${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Your message was sent to the admin." });
  } catch (err) {
    console.error("❌ Contact admin error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// ✅ Get all artisans with product counts
export const getArtisans = async (req, res) => {
  try {
    const artisans = await User.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "artisan",
          as: "products"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          createdAt: 1,
          productCount: { $size: "$products" }
        }
      },
      {
        $match: { productCount: { $gt: 0 } }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // Add dummy artisans if none exist
    if (artisans.length === 0) {
      const dummyArtisans = [
        {
          _id: "dummy1",
          name: "Aarav Mehta",
          email: "aarav@example.com",
          createdAt: new Date(),
          productCount: 3
        },
        {
          _id: "dummy2", 
          name: "Priya Sharma",
          email: "priya@example.com",
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          productCount: 5
        },
        {
          _id: "dummy3",
          name: "Ravi Kumar", 
          email: "ravi@example.com",
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          productCount: 2
        }
      ];
      return res.json(dummyArtisans);
    }

    res.json(artisans);
  } catch (err) {
    console.error("❌ Get artisans error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
