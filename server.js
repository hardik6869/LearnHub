const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// Load ENV File
dotenv.config({ path: "./config/config.env" });

connectDB();

// Route Files
const academies = require("./routes/academies");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

// Initialize Express
const app = express();

// Ensure extended query parsing (uses 'qs' library under the hood)
app.set("query parser", "extended");

// Body parser (for req.body)
app.use(express.json());

// cookie Parse
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File Upload
app.use(fileUpload());

// Sanitize data
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Set Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Min
  limit: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Prevent Http Params Polution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Mount Routers
app.use("/api/v1/academies", academies);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on ${PORT}`.yellow.bold),
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
