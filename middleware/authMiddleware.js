require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.cookies.jwt;

  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("Decoded token:", decoded);

    req.user = { userId: decoded.userId };
    req.decodedToken = decoded;

    next();
  });
}

module.exports = { verifyToken };
