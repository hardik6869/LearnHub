import path from "path";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { bold } from "colors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import { assertRequiredEnv } from "./config/env";
import { ROOT_DIR } from "./config/paths";
import errorHandler from "./middleware/error";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";

// Route Files
import academies from "./routes/academies";
import courses from "./routes/courses";
import auth from "./routes/auth";
import users from "./routes/users";
import reviews from "./routes/reviews";

// Load ENV File
dotenv.config({ path: "./config/config.env" });
assertRequiredEnv();

void connectDB();

// Initialize Express
const app = express();

// Behind proxies (Vercel rewrite → Render load balancer), trust that many hops so req.ip and
// the rate limiter see the real client IP
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY));
}

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
  if (req.body) mongoSanitize.sanitize(req.body as Record<string, unknown>);
  mongoSanitize.sanitize(req.params);
  mongoSanitize.sanitize(req.query);
  next();
});

// Set Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Health check for Render; above the rate limiter so frequent probes never get a 429
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true });
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Min
  limit: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Prevent Http Params Polution
app.use(hpp());

// Enable CORS for the frontend only, with cookies (no CLIENT_URL: no cross-origin access)
app.use(cors({ origin: process.env.CLIENT_URL ?? false, credentials: true }));

// Set Static Folder
app.use(express.static(path.join(ROOT_DIR, "public")));

// Mount Routers
app.use("/api/v1/academies", academies);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, (error) => {
  // Express 5 routes listen errors (e.g. EADDRINUSE) here; rethrow so they still crash the process
  if (error) throw error;
  // bold() as a call: `.bold` on strings is typed as the legacy String.prototype.bold method
  console.log(bold(`Server running on ${PORT}`.yellow));
});

process.on("unhandledRejection", (err: unknown) => {
  const message = err instanceof Error ? err.message : undefined;
  console.log(`Error: ${String(message)}`.red);
  server.close(() => process.exit(1));
});
