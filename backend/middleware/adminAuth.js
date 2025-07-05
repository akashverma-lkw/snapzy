import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin || decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Error in verifyAdmin middleware:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default verifyAdmin;
