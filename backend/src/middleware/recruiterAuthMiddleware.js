import authMiddleware from "./authMiddleware.js";
import Recruiter from "../models/recruiter.js";

const recruiterAuthMiddleware = [
  authMiddleware,
  async (req, res, next) => {
    try {
      if (req.user?.role && req.user.role !== "recruiter") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Recruiter privileges required.",
        });
      }

      const recruiter = await Recruiter.findById(req.user.id)
        .select("-password")
        .populate("company");

      if (!recruiter) {
        return res.status(401).json({
          success: false,
          message: "Recruiter account not found.",
        });
      }

      if (recruiter.status === "Inactive") {
        return res.status(403).json({
          success: false,
          message: "Account is inactive. Please contact support or system admin.",
        });
      }

      req.user = {
        id: recruiter._id.toString(),
        role: "recruiter",
      };
      req.recruiter = recruiter;

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid recruiter session.",
      });
    }
  },
];

export default recruiterAuthMiddleware;
