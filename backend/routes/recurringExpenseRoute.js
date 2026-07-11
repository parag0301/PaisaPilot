import express from "express";
import { authMiddleware } from "../middleware/auth.js";

import {
  addRecurringExpense,
  getRecurringExpenses,
  acceptRecurringExpense,
  skipRecurringExpense,
  cancelRecurringExpense,
} from "../controllers/recurringExpenseController.js";

const recurringExpenseRouter = express.Router();

recurringExpenseRouter.post("/add", authMiddleware, addRecurringExpense);
recurringExpenseRouter.get("/get-all", authMiddleware, getRecurringExpenses);
recurringExpenseRouter.put("/accept/:id", authMiddleware, acceptRecurringExpense);
recurringExpenseRouter.put("/skip/:id", authMiddleware, skipRecurringExpense);
recurringExpenseRouter.put("/cancel/:id", authMiddleware, cancelRecurringExpense);

export default recurringExpenseRouter;
