import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

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
    console.log("🚀 ~ registerUser ~ error:", error);

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
    console.log("🚀 ~ registerUser ~ error:", error);

    return res.status(500).json({ message: "error" });
  }
}

export async function getAllBooks(req, res) {
  try {
    console.log(req.user);
    const books = await prisma.book.findMany();
    return res.status(200).json(books);
  } catch (error) {
    console.log("🚀 ~ getAllBooks ~ error:", error);

    return res.status(500).json({ message: "error" });
  }
}

export async function getOneBookById(req, res) {
  try {
    const id = +req.params.id;

    const book = await prisma.book.findUnique({ where: { id: id } });

    if (!book) {
      return res.status(404).send({ message: "book not found" });
    }
    return res.status(200).send(book);
  } catch (error) {
    console.log("🚀 ~ getAllBooks ~ error:", error);

    return res.status(500).json({ message: "error" });
  }
}

export async function createBook(req, res) {
  try {
    if (!req.body.judul) {
      return res.status(400).json({ message: "Judul required" });
    }
    if (!req.body.deskripsi) {
      return res.status(400).json({ message: "Deskripsi required" });
    }
    if (!req.body.halaman) {
      return res.status(400).json({ message: "Halaman required" });
    }
    if (!req.body.sampul) {
      return res.status(400).json({ message: "Halaman required" });
    }
    const book = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      sampul: req.body.sampul,
      halaman: Number(req.body.halaman),
      pemilik: req.user.email,
    };

    const createBook = await prisma.book.create({
      data: {
        ...book,
      },
    });

    return res.status(201).send(createBook);
  } catch (error) {
    console.log("🚀 ~ getAllBooks ~ error:", error);

    res.status(500).json({ message: "error" });
  }
}
export async function editBook(req, res) {
  try {
    if (!req.body.judul) {
      return res.status(400).json({ message: "Judul required" });
    }
    if (!req.body.deskripsi) {
      return res.status(400).json({ message: "Deskripsi required" });
    }
    if (!req.body.halaman) {
      return res.status(400).json({ message: "Halaman required" });
    }
    if (!req.body.sampul) {
      return res.status(400).json({ message: "Halaman required" });
    }

    const id = +req.params.id;

    const book = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      sampul: req.body.sampul,
      halaman: Number(req.body.halaman),
      pemilik: req.user.email,
    };

    const findBook = await prisma.book.findUnique({ where: { id: id } });

    if (!findBook) {
      return res.status(404).send({ message: "book not found" });
    } else {
      const updateBook = await prisma.book.update({
        where: {
          id: id,
        },
        data: {
          ...book,
        },
      });

      return res.status(200).send(updateBook);
    }
  } catch (error) {
    console.log("🚀 ~ getAllBooks ~ error:", error);

    res.status(500).json({ message: "error" });
  }
}

export async function deleteBook(req, res) {
  try {
    const id = +req.params.id;

    const findBook = await prisma.book.findUnique({ where: { id: id } });

    if (!findBook) {
      return res.status(404).send({ message: "book not found" });
    } else {
      if (findBook.pemilik === req.user.email) {
        await prisma.book.delete({
          where: {
            id: id,
          },
        });

        return res.status(200).send({ message: "book has been deleted" });
      } else {
        return res.status(404).send({ message: "book not found" });
      }
    }
  } catch (error) {
    console.log("🚀 ~ getAllBooks ~ error:", error);

    res.status(500).json({ message: "error" });
  }
}
