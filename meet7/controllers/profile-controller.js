import "dotenv/config";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getUserProfile(req, res) {
  try {
    const userProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({
        message: "profile not found, please create your profile first",
      });
    }

    return res.status(200).json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
}

export async function createUserProfile(req, res) {
  try {
    if (!req.body.firstName || req.body.firstName === "") {
      return res.status(400).json({ message: "First Name required" });
    }
    if (!req.body.lastName || req.body.lastName === "") {
      return res.status(400).json({ message: "Last Name required" });
    }

    if (!req.body.bio || req.body.bio === "") {
      return res.status(400).json({ message: "Bio required" });
    }
    const profile = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      userId: req.user.id,
    };

    const createProfile = await prisma.profile.create({ data: { ...profile } });

    return res.status(201).json(createProfile);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
}

export async function editUserProfile(req, res) {
  try {
    if (!req.body.firstName || req.body.firstName === "") {
      return res.status(400).json({ message: "First Name required" });
    }
    if (!req.body.lastName || req.body.lastName === "") {
      return res.status(400).json({ message: "Last Name required" });
    }

    if (!req.body.bio || req.body.bio === "") {
      return res.status(400).json({ message: "Bio required" });
    }
    const profile = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
    };
    //temukan profile user
    const userProfile = await prisma.profile.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!userProfile) {
      return res.status(404).json({
        message: "profile not found, please create your profile first",
      });
    }

    const updateProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        ...profile,
      },
    });

    return res.status(200).json(updateProfile);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
}
