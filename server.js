const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const mongoose = require("mongoose");
const routePath = require("./routes/billBoardRoute.js")
const campRoutePath=require("./routes/campaignRoute.js")
const clientRoutePath=require("./routes/clientRoute.js")
const leaseAgreementRoutePath=require("./routes/leaseAgreementRoute.js")
const invoiceRoutePath = require("./routes/invoiceRoute.js")
require("dotenv").config();
const fileUpload = require("express-fileupload");


const app = express();
// const allowedOrigins = [
//     process.env.FRONTEND_URL, 
//     "http://localhost:5173",
// 	"https://streetsight.vercel.app/"
// ].filter(Boolean);
// app.use(cors({ 
//     origin: allowedOrigins,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true 
// }));
// console.log(process.env.FRONTEND_URL);
// app.use(cors({ origin: " https://streetsight.vercel.app/" || "*", credentials: true }));
const allowedOrigins = [
    "https://streetsight.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload()); // Enable file uploads

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
// **Logout Route**
app.post("/api/logout", (req, res) => {
	// Clear token cookie
	res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });
	res.status(200).json({ message: "Logout successful" });
});

app.use("/api/billboard", routePath);
app.use("/api/campaign", campRoutePath)
app.use("/api/client", clientRoutePath)
app.use("/api/invoice", invoiceRoutePath);
app.use("/api/leaseagreement", leaseAgreementRoutePath);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
