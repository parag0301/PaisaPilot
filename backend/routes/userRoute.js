import express from "express";
import { getCurrentUser, registerUser,loginUser, updateUserPassword, updateUserProfile } from "../controllers/userController.js";

import { authMiddleware } from "../middleware/auth.js";


const userRouteer = express.Router();

userRouteer.post("/register", registerUser);
userRouteer.post("/login", loginUser);

// Protected route to get user profile details
userRouteer.get("/me", authMiddleware,getCurrentUser);
userRouteer.put("/profile", authMiddleware, updateUserProfile);
userRouteer.put("/password", authMiddleware, updateUserPassword);

export default userRouteer;
     
