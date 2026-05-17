import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

//add income
export async function addIncome(req, res) {
    const userId = req.user._id
    const { description, amount, category, date } = req.body; //prder for date is (yy-mm-dd) in frontend
    
    try{
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success: false,
                 message: "All fields are required" 
            });
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        await newIncome.save();

        res.json({
            success: true,
            message: "Income added successfully",
            
        });
    }

    catch(error){
        console.log("Error adding income:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add income",
        });
    }
}

//get all income

export async function getAllIncome(req, res) {
    const userId = req.user._id;

    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        res.json(incomes);   
    }
    catch (error) {
        console.log("Error fetching incomes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch incomes",
        });
    }
}

//update income
export async function updateIncome(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount},
            { new: true }
        ); 

        if(!updatedIncome) {
            return res.status(400).json({
                success: false,
                message: "Income not found or user not authorized",
            });
        }

        res.json({
            success: true,
            message: "Income Updated Successfully",
            data: updatedIncome
        });
    }
    catch (error) {
        console.log("Error updating income:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update income",
        });
    }
}

//delete income
export async function deleteIncome(req, res) {
   try{
    const income = await incomeModel.findByIdAndDelete({_id: req.params.id});
    if(!income) {
        return res.status(404).json({
            success: false,
            message: "Income not found",
        });
    }
    return res.json({
        success: true,
        message: "Income deleted successfully",
    });
    }
    
    catch (error) {
    console.log("Error deleting income:", error);
    res.status(500).json({
        success: false,
        message: "Failed to delete income"
    });
   }
}
//-----------------------------------------------------------------------------------------------------//

// to download the data from webiste to excel sheet
export async function downloadIncomeExcel(req, res){
    const userId = req.user._id;
    try{
        const income = await incomeModel.find({userId}).sort({date: -1});
        const plainData = income.map((inc) => ({
            description: inc.description,
            amount: inc.amount,
            category: inc.category,
            date: new Date(inc.date).toLocaleDateString(),   // Format date as YYYY-MM-DD
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "incomesModel");
        XLSX.writeFile(workbook, "Incomes_Details.xlsx");
        res.download("Incomes_Details.xlsx");
    }
    catch (error) {
        console.log("Error downloading income data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to Download Income Data",
        });
    }   
}
//-----------------------------------------------------------------------------------------------------//
// to get user income overview (daily, weekly, montly,year)
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const {range ="monthly"} = req.query;
        const {start, end} = getDateRange(range);

        const incomes = await incomeModel.find({
            userId,
            date: {$gte: start, $lte: end},
        }).sort({date: -1});

    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const numberOfTransactions = incomes.length;
    const recentTransactions = incomes.slice(0, 9);

    res.json({
        success: true,
        data: {
            totalIncome,
            averageIncome,
            numberOfTransactions,
            recentTransactions,
        }
    });
}
    catch (error) {
        console.log("Error fetching income overview:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch income overview",
        });
    }
}
