import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const protectedRoutes = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let authToken;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        authToken = authHeader.split(" ")[1];
    }

    if (!authToken) {
        return next(new AppError(401, "Unauthorized"));
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("user", req.user);
        return next();
    } catch (err) {
        return next(new AppError(401, "Invalid Token"))
    }

})


export const restrictedTo = (...roles) => {
    console.log("roles", roles);
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, "Forbidden"));
        }
        next();
    };
};