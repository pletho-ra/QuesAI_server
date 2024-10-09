import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import myUser from "./routes/myUser.routes.js";
import ExpressMongoSanitize from "express-mongo-sanitize";

// rate limiter to avoid brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again later",
});

// app
const app = express();
app.use(express.json({ limit: "10kb" }));

// middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use("/api", limiter);
app.use(ExpressMongoSanitize());
app.use(cors());
app.use(morgan("common"));

//health check
app.get("/health", async (req, res) => {
  res.status(200).send("Server is up and running");
});

// Routes
app.use("/api/v1/user", myUser);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! Please try again later.");
});

export default app;
