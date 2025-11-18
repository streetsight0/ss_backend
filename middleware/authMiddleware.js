const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify JWT token
 * Checks Authorization header for Bearer token
 * Adds decoded user info to req.user
 */
const verifyToken = (req, res, next) => {
	try {
		// Get token from Authorization header
		const authHeader = req.headers.authorization;
		
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ 
				error: "Access denied. No token provided.",
				message: "Authorization header with Bearer token is required" 
			});
		}

		// Extract token (remove "Bearer " prefix)
		const token = authHeader.substring(7);

		// Verify token
		const decoded = jwt.verify(token, JWT_SECRET);
		
		// Add user info to request object
		req.user = decoded;
		
		// Continue to next middleware/route handler
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ 
				error: "Token expired",
				message: "Your session has expired. Please login again." 
			});
		}
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ 
				error: "Invalid token",
				message: "Invalid authentication token" 
			});
		}
		return res.status(500).json({ 
			error: "Server error during authentication",
			message: error.message 
		});
	}
};

/**
 * Optional middleware - doesn't fail if no token
 * Useful for routes that work with or without authentication
 */
const optionalAuth = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		
		if (authHeader && authHeader.startsWith("Bearer ")) {
			const token = authHeader.substring(7);
			const decoded = jwt.verify(token, JWT_SECRET);
			req.user = decoded;
		}
		
		next();
	} catch (error) {
		// Continue without user info if token is invalid
		next();
	}
};

module.exports = { verifyToken, optionalAuth };

