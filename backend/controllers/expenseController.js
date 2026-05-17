import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import XLSX from "xlsx";

//add expense
export async function addExpense(req, res) {
    const userId = req.user._id
    const { description, amount, category, date } = req.body; //prder for date is (yy-mm-dd) in frontend

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        await newExpense.save();

        res.json({
            success: true,
            message: "Expense added successfully!",

        });
    } catch (error) {
        console.log("Error adding expense:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add expense",
        });
    }
}

//get all the expense

export async function getAllExpense(req, res) {
    const userId = req.user._id;

    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    }
    catch (error) {
        console.log("Error fetching expenses:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch expenses",
        });
    }
}

//to update the expense
export async function updateExpense(req, res) {
    const userId = req.user._id;
    const expenseId = req.params.id;
    const { description, amount, category, date } = req.body;

    try {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: expenseId, userId },
            { description, amount, category, date },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(400).json({
                success: false,
                message: "Expense not found or user not authorized",
            });
        }

        res.json({
            success: true,
            message: "Expense Updated Successfully",
            data: updatedExpense
        });
    }
    catch (error) {
        console.log("Error updating expense:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update expense",
        });
    }
}
// delete an particular expense
export async function deleteExpense(req, res) {
    try{
    const expense = await expenseModel.findByIdAndDelete({_id: req.params.id});
    if(!expense) {
        return res.status(404).json({
            success: false,
            message: "Expense not found",
        });
    }
    return res.json({
        success: true,
        message: "Expense deleted successfully",
    });
    }
    
    catch (error) {
    console.log("Error deleting expense:", error);
    res.status(500).json({
        success: false,
        message: "Failed to delete expense"
    });
   }
}

//download excel for expense data
export async function downloadExpenseExcel(req, res){
    try{
        const expense = await expenseModel.find({userId}).sort({date: -1});
        const plainData = expense.map((exp) => ({
            description: exp.description,
            amount: exp.amount,
            category: exp.category,
            date: new Date(exp.date).toLocaleDateString(),   // Format date as YYYY-MM-DD
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
        XLSX.writeFile(workbook, "Expenses_Details.xlsx");
        res.download("Expenses_Details.xlsx");
    }
    catch (error) {
        console.log("Error downloading expense data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to Download Expense Data",
        });
    } 
}

//to get the overview of the expense

export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;
        const {range ="monthly"} = req.query;
        const {start, end} = getDateRange(range);

        const expense = await expenseModel.find({
            userId,
            date: {$gte: start, $lte: end},
        }).sort({date: -1});

     const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;
    const recentTransactions = expense.slice(0, 5);

    res.json({
        success: true,
        data: {
            totalExpense,
            averageExpense,
            numberOfTransactions,
            recentTransactions,
            range
        }
    });
}
    catch (error) {
        console.log("Error fetching expense overview:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch expense overview",
        });
    }
}
    
