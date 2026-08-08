import jwt from "jsonwebtoken";

const generateToken = (user, customRole) => {
  const secret = process.env.JWT_SECRET || "fallback_jwt_secret_key_123456";

  let id;
  let role = customRole;

  if (user && user._id) {
    id = user._id.toString();
    role = role || user.role;
  } else if (typeof user === "string") {
    id = user;
  } else if (user && typeof user.toString === "function") {
    id = user.toString();
  } else {
    id = String(user || "");
  }

  return jwt.sign(
    {
      id,
      role: role || "student",
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
  );
};

export default generateToken;
