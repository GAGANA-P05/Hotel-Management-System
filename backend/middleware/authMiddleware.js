const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

// Verify for Manager
const verifyManager = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ success: false, error: "Token missing" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "Manager")
      return res.status(403).json({ success: false, error: "Access denied" });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};

// Verify for Customer
const verifyCustomer = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ success: false, error: "Token missing" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "Customer")
      return res.status(403).json({ success: false, error: "Access denied" });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};

module.exports = { verifyManager, verifyCustomer };
