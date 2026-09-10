import jwt from "jsonwebtoken";
import College from "../models/college.js";
import { errorResponse } from "../utils/apiResponse.js";

const collegeAuth = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No Token
    if (!token) {
      return errorResponse(res, "Access denied. No token provided.", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return errorResponse(res, "JWT_SECRET is not configured on server.", 500);
    }

    // Verify JWT
    const decoded = jwt.verify(token, secret);

    // Verify Role Claim
    if (decoded.role && decoded.role !== "college") {
      return errorResponse(
        res,
        "Access denied. College privileges required.",
        403
      );
    }

    // Find College
    const college = await College.findById(decoded.id).select("-password");

    if (!college) {
      return errorResponse(res, "College not found.", 404);
    }

    // Check College Status
    if (college.status === "Inactive") {
      return errorResponse(
        res,
        "College account is inactive. Please contact system administrator.",
        403
      );
    }

    // Store logged-in college and user session
    req.college = college;
    req.user = {
      id: college._id.toString(),
      role: "college",
    };

    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token.", 401);
  }
};

export default collegeAuth;