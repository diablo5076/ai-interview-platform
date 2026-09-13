import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";

import { prisma } from "../lib/prisma.js";
import { auth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const createToken = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: "7d",
  });
};

router.post("/signup", async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;

    if (typeof rawEmail !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const email = rawEmail.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Signup failed:", error);

    return res.status(500).json({
      message: "User creation failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;

    if (typeof rawEmail !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const email = rawEmail.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        message:
          "This account uses Google login. Please continue with Google.",
      });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user.id);

    return res.json({
      token,
    });
  } catch (error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    {
      session: false,
    },
    (
      error: unknown,
      user: Express.User | false | null
    ) => {
      if (error) {
        console.error("Google callback error:", error);

        return res.redirect(
          "http://localhost:3000/login?error=google_auth_failed"
        );
      }

      if (!user) {
        return res.redirect(
          "http://localhost:3000/login?error=google_auth_failed"
        );
      }

      try {
        const authenticatedUser = user as { id: string };
        const token = createToken(authenticatedUser.id);

        return res.redirect(
          `http://localhost:3000/auth/google/callback?token=${encodeURIComponent(
            token
          )}`
        );
      } catch (tokenError) {
        console.error(
          "Failed to create Google login token:",
          tokenError
        );

        return res.redirect(
          "http://localhost:3000/login?error=authentication_failed"
        );
      }
    }
  )(req, res, next);
});

router.get("/me", auth, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        interviews: {
          select: {
            completed: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const totalInterviews = user.interviews.length;
    const completedInterviews = user.interviews.filter(
      (interview) => interview.completed
    ).length;
    const pendingInterviews =
      totalInterviews - completedInterviews;

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
      stats: {
        totalInterviews,
        completedInterviews,
        pendingInterviews,
      },
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);

    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
});

router.put("/change-password", auth, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message:
          "New password must be different from the current password",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "Google accounts do not have a password. Please use Google login.",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update failed:", error);

    return res.status(500).json({
      message: "Failed to update password",
    });
  }
});

export default router;