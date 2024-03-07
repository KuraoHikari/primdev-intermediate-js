import { Router } from "express";
import {
  createBook,
  createUserProfile,
  deleteBook,
  editBook,
  editUserProfile,
  getAllBooks,
  getOneBookById,
  getUserProfile,
  likeBook,
  loginUser,
  registerUser,
} from "./controller.js";
import { authMiddleware } from "./auth.js";
import upload from "./multer.js";
import imgValidate from "./imageValidation.js";

const router = Router();

//register
router.post("/register", registerUser);
//Login
router.post("/login", loginUser);

//Profile route
router.get("/profile/me", authMiddleware, getUserProfile);
router.post("/profile/create", authMiddleware, createUserProfile);
router.patch("/profile/edit", authMiddleware, editUserProfile);
//end Profile route

//get All Books
router.get("/books", authMiddleware, getAllBooks);
//get One Book with id
router.get("/book/:id", authMiddleware, getOneBookById);
//create Book
router.post(
  "/book/create",
  upload.single("sampul"),
  authMiddleware,
  imgValidate,
  createBook
);
//edit Book
router.patch(
  "/book/edit/:id",
  authMiddleware,
  upload.single("sampul"),
  imgValidate,
  editBook
);
//delete Book
router.delete("/book/delete/:id", authMiddleware, deleteBook);

//Like route
router.post("/like/:bookId", authMiddleware, likeBook);
router.get("/like/:bookId");
//end Like route

export default router;
