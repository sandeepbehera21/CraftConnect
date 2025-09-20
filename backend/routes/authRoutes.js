import express from "express";
import { body } from "express-validator";
import { signup, login, updateProfile, contactAdmin, getArtisans } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// routes
router.post(
  "/signup",
  [
    body("name").isString().isLength({ min: 2 }).trim(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 })
  ],
  signup
);
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 })
  ],
  login
);

// protected routes
router.get("/me", protect, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

router.put("/profile", protect, updateProfile);

// contact admin (protected)
router.post("/contact", protect, [
  body("subject").isString().isLength({ min: 3 }).trim(),
  body("message").isString().isLength({ min: 10, max: 2000 }).trim(),
], contactAdmin);

// get artisans (public)
router.get("/artisans", getArtisans);

export default router;
