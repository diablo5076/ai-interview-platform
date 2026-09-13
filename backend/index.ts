import express from "express";
import { prisma } from "./lib/prisma.js";
import authRouter from "./routes/auth.js";
import { auth, type AuthRequest } from "./middleware/auth.js";
import interviewRouter from "./routes/interview.js";
import questionRouter from "./routes/question.js";
import aiRouter from "./routes/ai.js";
import cors from "cors";
import resumeRouter from "./routes/resume.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/question", questionRouter);
app.use("/api/ai", aiRouter);
app.use("/api/resume", resumeRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "AI Interview Platform API is running",
  });
});

app.get("/profile", auth, async (req: AuthRequest, res) => {
  res.json({
    message: "Protected route works",
    userId: req.userId,
  });
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();