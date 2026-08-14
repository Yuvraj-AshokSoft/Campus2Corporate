import authMiddleware from "./authMiddleware.js";
import College from "../models/college.js";

const collegeAuthMiddleware = [
  authMiddleware,
  async (req, res, next) => {
    try {
      if (req.user?.role !== "college") {
        return res.status(403).json({
          success: false,
          message: "Access denied. College privileges required.",
        });
      }

      const college = await College.findById(req.user.id).select("-password");

      if (!college) {
        return res.status(401).json({
          success: false,
          message: "College account not found.",
        });
      }

      if (college.status === "Inactive") {
        return res.status(403).json({
          success: false,
          message: "College account is inactive. Please contact system administrator.",
        });
      }

      req.user = {
        id: college._id.toString(),
        role: "college",
      };
      req.college = college;

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid college session.",
      });
    }
  },
];

export default collegeAuthMiddleware;
