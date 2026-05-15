import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

/* =========================================================
   PROTECTED ROUTES (AUTH CHECK)
========================================================= */
export const protectedRoutes = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  let token;

  // Extract token from Bearer header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new AppError(401, "Unauthorized - No token provided"));
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch real user from DB (IMPORTANT FIX)
    const currentUser = await User.findById(decoded.id).select("-password");

    if (!currentUser) {
      return next(new AppError(401, "User no longer exists"));
    }

    // Attach full user to request
    req.user = currentUser;

    next();
  } catch (err) {
    return next(new AppError(401, "Invalid or expired token"));
  }
});

/* =========================================================
   ROLE BASED ACCESS CONTROL
========================================================= */
export const restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "Forbidden - You do not have permission")
      );
    }

    next();
  };
};