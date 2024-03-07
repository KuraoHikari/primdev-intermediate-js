import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { handleUpload } from "./coudinary.js";

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

export async function getUserProfile(req, res) {
  try {
    // const userProfile = await prisma.user.findUnique({
    //   where: { id: req.user.id },
    //   include: {
    //     profile: true,
    //   },
    // });

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
    console.log("🚀 ~ registerUser ~ error:", error);

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
    console.log("🚀 ~ registerUser ~ error:", error);

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
    console.log("🚀 ~ registerUser ~ error:", error);

    return res.status(500).json({ message: "error" });
  }
}

export async function getAllBooks(req, res) {
  try {
    console.log(req.user);
    const books = await prisma.book.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
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
    // if (!req.body.sampul) {
    //   return res.status(400).json({ message: "Halaman required" });
    // }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);

    const book = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      sampul: cldRes.secure_url,
      halaman: Number(req.body.halaman),
      userId: req.user.id,
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
  console.log("🚀 ~ createBook ~ req.file:", req.file);
  console.log("🚀 ~ createBook ~ req.file:", req.file);
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

    const id = +req.params.id;

    const findBook = await prisma.book.findUnique({ where: { id: id } });

    if (!findBook) {
      return res.status(404).send({ message: "book not found" });
    } else {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);

      const book = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        sampul: cldRes.secure_url,
        halaman: Number(req.body.halaman),
        userId: req.user.id,
      };
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
      if (findBook.userId === req.user.id) {
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

export async function likeBook(req, res) {
  try {
    const bookId = +req.params.bookId;

    const findBook = await prisma.book.findUnique({ where: { id: bookId } });

    if (!findBook) {
      return res.status(404).send({ message: "book not found" });
    }

    const hasBeenLike = await prisma.like.findFirst({
      where: {
        AND: {
          bookId: bookId,
          userId: req.user.id,
        },
      },
    });

    if (hasBeenLike) {
      await prisma.like.delete({
        where: {
          userId_bookId: {
            bookId: bookId,
            userId: req.user.id,
          },
        },
      });
      return res.status(200).json({ message: "book disLiked successfully" });
    } else {
      await prisma.like.create({
        data: {
          userId: req.user.id,
          bookId: bookId,
        },
      });

      return res.status(201).json({ message: "book liked successfully" });
    }
  } catch (error) {
    console.log("🚀 ~ registerUser ~ error:", error);

    return res.status(500).json({ message: "error" });
  }
}
