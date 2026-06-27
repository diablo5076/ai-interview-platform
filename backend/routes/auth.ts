import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
        
      }
    });
  
    res.json({
      id: user.id,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({
      message: "User creation failed"
    });
  }
});

router.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const matched = await bcrypt.compare(
      password,
      user.password
    );

    if (!matched) {
      return res.status(401).json({
        message: "Invalid crendentials"
      });
    }
    const token = jwt.sign(
      {
        userId: user.id
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    );
    res.json({
      token
    });
  } catch {
    res.status(500).json({
      message: "Login failed"
    });
  }
});

export default router;