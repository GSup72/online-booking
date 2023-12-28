require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

// function verifyToken(req, res, next) {
// 	const token = req.headers.authorization;

// 	if (!token) {
// 		return res.status(401).json({ error: 'Authorization token is missing' });
// 	}

// 	jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
// 		console.log('Decoded token:', decoded);
// 		if (err) {
// 			return res.status(401).json({ error: 'Invalid token' });
// 		}

// 		req.decodedToken = decoded;

// 		next();
// 	});
// }

module.exports = { verifyToken };

function verifyToken(req, res, next) {
  const token = req.cookies.jwt;

  console.log("Token:", token); // Add this line to print the token

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err); // Log the error for further inspection
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("Decoded token:", decoded); // Add this line to print the decoded content

    // Attach user information to req.user
    req.user = { userId: decoded.userId }; // Set req.user with userId
    req.decodedToken = decoded;

    next();
  });
}

module.exports = { verifyToken };
