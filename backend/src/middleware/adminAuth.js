import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const adminAuth = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Token not found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Secure environment-driven secret (no hardcoded fallback)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Critical Security Error: JWT_SECRET environment variable is not defined.");
      return res.status(500).json({
        success: false,
        message: "Authentication service misconfigured.",
      });
    }

    // Verify Token
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid or malformed token payload.",
      });
    }

    // Enforce role on token payload if present
    if (decoded.role && !["Admin", "Super Admin"].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    // Find Admin in DB to ensure account is fresh, active, and valid
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Enforce DB role check
    if (!["Admin", "Super Admin"].includes(admin.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    // Enforce Active Status
    if (admin.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin account is inactive or suspended.",
      });
    }

    // Attach admin to request
    req.admin = admin;
    req.user = admin;

    next();
  } catch (error) {
    console.error("Error in adminAuth middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal authentication error.",
    });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== "Super Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin privileges required.",
    });
  }
  next();
};

export default adminAuth;