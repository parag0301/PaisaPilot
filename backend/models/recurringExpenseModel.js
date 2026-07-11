import mongoose from "mongoose";

const recurringExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      default: "monthly",
    },
    startDate: {
      type: Date,
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const recurringExpenseModel =
  mongoose.models.recurringExpense ||
  mongoose.model("recurringExpense", recurringExpenseSchema);

export default recurringExpenseModel;