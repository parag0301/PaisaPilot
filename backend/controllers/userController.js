import userModel from '../models/userModel.js';
import validator from 'validator'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "abc123"; 
const TOKEN_EXPIRES = '24h'; // Token expiration time

// Function to create JWT token

const createToken = (userId) =>
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });


//REGISTER USER

export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All Fields Are Required."
        });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Email"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password Must Be At Least 6 Characters."
        });
    }

    try {
        if (await userModel.findOne({ email })) {
            return res.status(400).json({
                success: false,
                message: "Email Already Exists."
            });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashed });
        const token = createToken(user._id);
        res.status(201).json({
            success: true,
            message: "Ussser Registered Successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
}

// User login 

export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Both fields are required."
        });
    }

try {
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Check your email or password."
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Check your email or password(Invalid)."
        });
    }

    const token = createToken(user._id);
    res.json({
        success: true,
        message: "Login Successful.",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

catch (error) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Server Error."
    });
    }
}

// to get user profile details--

export async function getCurrentUser(req, res){
    try {
        const user = await 
        
        userModel.findById(req.user.id).select('name email');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found."
            });
        }
        res.json({
            success: true,
            user
        });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
}

    // to update a user profile details--

export async function updateUserProfile(req, res){
    const { name, email } = req.body;
    if (!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid input data ."
        });
    }

    try {
        const exists = await userModel.findOne({email, _id: { $ne: req.user.id }});
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Email Already In Use."
            }); 
        }
        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true, select: 'name email' }
        );
        res.json({
            success: true,
            message: "Your Profile Is Updated Successfully.",
            user
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
}

//to change a user password--

export async function updateUserPassword(req, res){
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Invalid Paassword."
        });
    }
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found."
            });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current Password Is Incorrect."
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({
            success: true,
            message: "Password Changed Successfully."
        });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
}