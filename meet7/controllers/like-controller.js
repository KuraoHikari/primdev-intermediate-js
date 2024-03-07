import "dotenv/config";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    return res.status(500).json({ message: "error" });
  }
}
