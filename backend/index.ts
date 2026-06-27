import express from "express";
import { prisma } from "./lib/prisma";
import authRouter from "./routes/auth";
import { auth, AuthRequest } from "./middleware/auth";
import interviewRouter from "./routes/interview";
import questionRouter from "./routes/question";
import aiRouter from "./routes/ai";
import cors from "cors";


const app = express();

app.use(cors({
  origin: [
    "http://localhost:3001",
    "http://localhost:3002",
  ],
  credentials: true,
}));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/question", questionRouter);
app.use("/api/ai", aiRouter);

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

app.get("/profile", auth, async (req: AuthRequest, res) => {
  res.json({
    message: "Protected route works",
    userId: req.userId,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
