import jwt from "jsonwebtoken";

const generateToken = (target, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured in environment variables.");
  }

  let id;
  if (target && typeof target === "object" && (target._id || target.id)) {
    id = (target._id || target.id).toString();
  } else if (target) {
    id = target.toString();
  }

  const resolvedRole =
    role ||
    (target && typeof target === "object" && target.role) ||
    "student";

  return jwt.sign(
    {
      id,
      role: resolvedRole,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || "30d" }
  );
};

export default generateToken;

