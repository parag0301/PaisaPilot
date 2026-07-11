import recurringExpenseModel from "../models/recurringExpenseModel.js";
import expenseModel from "../models/expenseModel.js";

function addOneMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}

export async function addRecurringExpense(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const startDate = new Date(date);

    const recurringExpense = new recurringExpenseModel({
      userId,
      description,
      amount,
      category,
      frequency: "monthly",
      startDate,
      nextDueDate: addOneMonth(startDate),
    });

    await recurringExpense.save();

    res.json({
      success: true,
      message: "Recurring expense created successfully",
      data: recurringExpense,
    });
  } catch (error) {
    console.log("Error adding recurring expense:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add recurring expense",
    });
  }
}

export async function getRecurringExpenses(req, res) {
  const userId = req.user._id;

  try {
    const recurringExpenses = await recurringExpenseModel
      .find({ userId, status: "active" })
      .sort({ nextDueDate: 1 });

    res.json({
      success: true,
      data: recurringExpenses,
    });
  } catch (error) {
    console.log("Error fetching recurring expenses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recurring expenses",
    });
  }
}

export async function acceptRecurringExpense(req, res) {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const recurringExpense = await recurringExpenseModel.findOne({
      _id: id,
      userId,
      status: "active",
    });

    if (!recurringExpense) {
      return res.status(404).json({
        success: false,
        message: "Recurring expense not found",
      });
    }

    const newExpense = new expenseModel({
      userId,
      description: recurringExpense.description,
      amount: recurringExpense.amount,
      category: recurringExpense.category,
      date: recurringExpense.nextDueDate,
    });

    await newExpense.save();

    recurringExpense.nextDueDate = addOneMonth(recurringExpense.nextDueDate);
    await recurringExpense.save();

    res.json({
      success: true,
      message: "Recurring expense accepted and added to expenses",
      data: recurringExpense,
    });
  } catch (error) {
    console.log("Error accepting recurring expense:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept recurring expense",
    });
  }
}

export async function skipRecurringExpense(req, res) {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const recurringExpense = await recurringExpenseModel.findOne({
      _id: id,
      userId,
      status: "active",
    });

    if (!recurringExpense) {
      return res.status(404).json({
        success: false,
        message: "Recurring expense not found",
      });
    }

    recurringExpense.nextDueDate = addOneMonth(recurringExpense.nextDueDate);
    await recurringExpense.save();

    res.json({
      success: true,
      message: "Recurring expense skipped for this month",
      data: recurringExpense,
    });
  } catch (error) {
    console.log("Error skipping recurring expense:", error);
    res.status(500).json({
      success: false,
      message: "Failed to skip recurring expense",
    });
  }
}

export async function cancelRecurringExpense(req, res) {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const recurringExpense = await recurringExpenseModel.findOneAndUpdate(
      { _id: id, userId, status: "active" },
      { status: "cancelled" },
      { new: true }
    );

    if (!recurringExpense) {
      return res.status(404).json({
        success: false,
        message: "Recurring expense not found",
      });
    }

    res.json({
      success: true,
      message: "Recurring expense cancelled successfully",
      data: recurringExpense,
    });
  } catch (error) {
    console.log("Error cancelling recurring expense:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel recurring expense",
    });
  }
}