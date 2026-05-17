import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getDashboardOverview } from "../controllers/dashboardController.js";

const DashboardRouter = express.Router();

DashboardRouter.get("/", authMiddleware, getDashboardOverview);

export default DashboardRouter;