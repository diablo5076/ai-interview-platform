import { Router } from "express";
import { prisma } from "../lib/prisma";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/create", auth, async (req: AuthRequest, res) => {
  try {
    const { title, role, level, duration } = req.body;

    const interview = await prisma.interview.create({
      data: {
        title,
        role,
        level,
        duration,
        userId: req.userId!,
      },
    });
    res.json(interview);
  } catch {
    res.status(500).json({
      message: "Interview creation failed",
    });
  }
});

router.get("/my", auth, async (req: AuthRequest, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      where: {
        userId: req.userId,
      },
    });
    res.json(interviews);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch interviews",
    });
  }
});

router.put("/:id", auth, async (req: AuthRequest, res) => {
  try {
    const { title, role, level, duration } = req.body;
    const interview = await prisma.interview.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },

      data: {
        title,
        role,
        level,
        duration,
      },
    });

    res.json(interview);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Update failed",
    });
  }
});

router.delete("/:id", auth, async (req: AuthRequest, res) => {
  try {
    const deleted = await prisma.interview.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    res.json(deleted);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Delete failed",
    });
  }
});
export default router;
