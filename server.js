require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { verifyToken } = require("./middleware/authMiddleware");
const routePath = require("./routes/billBoardRoute.js")
const campRoutePath=require("./routes/campaignRoute.js")
const clientRoutePath=require("./routes/clientRoute.js")
const leaseAgreementRoutePath=require("./routes/leaseAgreementRoute.js")
const invoiceRoutePath = require("./routes/invoiceRoute.js")
const aiPricingRoutePath=require("./routes/aiPricingRoute.js")

const multer = require("multer");


const app = express();

const allowedOrigins = [
	"https://streetsight.vercel.app",
	"http://localhost:5173",
	"https://www.streetsight.ca",
	"https://streetsight.ca",
	"http://localhost:3000",
	"http://127.0.0.1:5173",
	"http://localhost:5174",
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        
        const originWithoutTrailingSlash = origin.replace(/\/$/, '');
        
        const isAllowed = allowedOrigins.some(allowed => {
            const allowedWithoutSlash = allowed.replace(/\/$/, '');
            return originWithoutTrailingSlash === allowedWithoutSlash;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin);
            console.log("Allowed origins:", allowedOrigins);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400
};

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.some(allowed => origin.replace(/\/$/, '') === allowed.replace(/\/$/, ''))) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.header('Access-Control-Max-Age', '86400');
    }
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    
    next();
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDb"))
	.catch((err) => console.error("MongoDB connection error", err));

const userSchema = new mongoose.Schema({
	username: String,
	email: { type: String, unique: true },
	password: String,
});

const User = mongoose.model("User", userSchema);

const JWT_SECRET = process.env.JWT_SECRET;

const users = [];

app.get("/", (req, res) => {
	res.send("Welcome to the server");
});

app.post("/register", async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(400).json({ error: "Email already exists" });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ username, email, password: hashedPassword });
		await newUser.save();

		const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
		res.json({ message: "User registered successfully!", token });
	} catch (error) {
		res.status(500).json({ error: "server error" });
	}
});

// Login Route
app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ error: "User not found" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

		// Generate a new token for each login attempt
		const token = jwt.sign({ email: user.email }, JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ message: "Login successful", token });
	} catch (error) {
		res.status(500).json({ error: "server error" });
	}
	
});

const handleGoogleOAuth = async (req, res) => {
	const { email } = req.body;
	
	try {
		if (!email) {
			return res.status(400).json({ error: "Email is required" });
		}

		let user = await User.findOne({ email });

		if (!user) {
			user = new User({
				email,
				username: email.split("@")[0],
			});
			await user.save();
		}

		const token = jwt.sign({ email: user.email }, JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ error: "Email already exists" });
		}
		console.error("Google OAuth error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

app.post("/api/auth/google", handleGoogleOAuth);
app.post("/api/google-login", handleGoogleOAuth);

// **Logout Route**
app.post("/api/logout", (req, res) => {
	// Clear token cookie
	res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });
	res.status(200).json({ message: "Logout successful" });
});

// Protected routes - require JWT authentication
app.use("/api/billboard", verifyToken, routePath);
app.use("/api/campaign", verifyToken, campRoutePath);
app.use("/api/client", verifyToken, clientRoutePath);
app.use("/api/invoice", verifyToken, invoiceRoutePath);
app.use("/api/leaseagreement", verifyToken, leaseAgreementRoutePath);
app.use("/api/aipricing", verifyToken, aiPricingRoutePath);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
