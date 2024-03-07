import "dotenv/config";

import { handleUpload } from "../utils/coudinary.js";
import prisma from "../utils/prisma.js";

export async function getAllBooks(req, res) {
  try {
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
    res.status(500).json({ message: "error" });
  }
}
