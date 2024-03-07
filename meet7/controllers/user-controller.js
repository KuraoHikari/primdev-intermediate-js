import "dotenv/config";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const findUser = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (findUser) {
      return res.status(403).json({ message: "User Already Exit" });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      email: req.body.email,
      username: req.body.username,
      password: hashPassword,
    };

    const createUser = await prisma.user.create({ data: { ...user } });

    return res.status(201).send(createUser);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
}

export async function loginUser(req, res) {
  try {
    const findUser = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (!findUser) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    const match = await bcrypt.compare(req.body.password, findUser.password);

    if (match) {
      //login
      var token = jwt.sign(
        { id: findUser.id, email: findUser.email },
        process.env.JWT_SECRET
      );

      return res.status(200).json({ token: token });
    } else {
      return res.status(403).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
}
