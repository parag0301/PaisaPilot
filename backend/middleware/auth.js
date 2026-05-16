import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "abc123";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized or token is missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const currentUser = await User.findById(payload.id).select("-password");

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({
      success: false,
      message: "Invalid token or expired token.",
    });
  }
}