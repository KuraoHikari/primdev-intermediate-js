import { Router } from "express";
import {
  createBook,
  deleteBook,
  editBook,
  getAllBooks,
  getOneBookById,
  loginUser,
  registerUser,
} from "./controller.js";
import { authMiddleware } from "./auth.js";

const router = Router();

//register
router.post("/register", registerUser);
//Login
router.post("/login", loginUser);
//get All Books
router.get("/books", authMiddleware, getAllBooks);
//get One Book with id
router.get("/book/:id", authMiddleware, getOneBookById);
//create Book
router.post("/book/create", authMiddleware, createBook);
//edit Book
router.patch("/book/edit/:id", authMiddleware, editBook);
//delete Book
router.delete("/book/delete/:id", authMiddleware, deleteBook);

export default router;
