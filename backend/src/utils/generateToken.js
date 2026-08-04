import jwt from "jsonwebtoken";

const generateToken = (userOrId, role = "student") => {
  const secret = process.env.JWT_SECRET || "fallback_jwt_secret_key_123456";

  let id;
  let userRole = role;

  if (typeof userOrId === "object" && userOrId !== null) {
    id = (userOrId._id || userOrId.id).toString();
    if (userOrId.role) {
      userRole = userOrId.role;
    }
  } else {
    id = userOrId.toString();
  }

  return jwt.sign(
    {
      id,
      role: userRole,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
  );
};

export default generateToken;
