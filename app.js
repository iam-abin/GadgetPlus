require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const createError = require("http-errors");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const nocache = require("nocache");

const connectDb = require("./config/db");
const errorHandler = require("./middlewares/errorHandiling");

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

const { USER_LAYOUT } = require("./config/constants");

const app = express();

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", USER_LAYOUT); // set default layout for user pages
app.use(expressLayouts); //middleware that helps to create reusable layouts for your views

// db connection
connectDb();

// Middlewares
app.use(cors());
app.use(logger("dev"));
app.use(express.json()); //for parsing json
app.use(express.urlencoded({ extended: false })); //for parsing form data

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
app.use(nocache());

// Session middleware
app.use(
	session({
		key: "user_sid",
		secret: "thisisthekeyforuser",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 6000000,
		},
	})
);

// throw new Error("hiiiii")


// Routes
app.use("/", userRoute);
app.use("/admin", adminRoute);

// 404 error handler
app.use((req, res, next) => {
	return next(createError(404, "Page Not Found"));
});

// General error handler
app.use(errorHandler);

console.clear();


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, "localhost", () => {
	// app.listen(PORT,'0.0.0.0', () => {
	console.log(`Server startes on http://localhost:${PORT}`);
	console.log("access using  https://gadgetplus.abi");
});
