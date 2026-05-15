import bcryptjs from "bcryptjs";
import { User } from "../model/user.model.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = asyncHandler(async (req, res, next) => {
    const { name, address, password, confirmPassword, email, role } = req.body;
    
    if (!name || !address || !password || !confirmPassword || !email) {
        return next(new AppError(400, "All fields are required"));
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError(400, "User already exists"));
    }
    
    if (password !== confirmPassword) {
        return next(new AppError(400, "Passwords must match"));
    }
    
    if (role && role !== "Patient" && role !== "Doctor") {
        return next(new AppError(400, "Invalid role"));
    }
    
    let imageUrl;
    if (req.file) {
        try {
            const fileUrl = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUrl.content);
            imageUrl = cloudResponse.secure_url;
        } catch (err) {
            return next(new AppError(500, "Failed to upload image"));
        }
    }
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
        name, 
        email, 
        address, 
        password: hashedPassword, 
        image: imageUrl,
        role: role || "Patient" // Default to Patient if not provided
    });
    
    const token = generateToken({ 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
            role: newUser.role,
            token,
        },
    });
});


export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return next(new AppError(400, "Email and password are required"));
    }
    
    // IMPORTANT: Use .select('+password') to include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
        return next(new AppError(401, "Invalid email or password"));
    }
    
    // Additional check to ensure password exists
    if (!user.password) {
        return next(new AppError(500, "User authentication data is incomplete"));
    }
    
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    
    if (!isPasswordMatch) {
        return next(new AppError(401, "Invalid email or password"));
    }
    
    const token = generateToken({ 
        id: user._id, 
        email: user.email, 
        role: user.role 
    });
    
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            token,
        }
    });
});