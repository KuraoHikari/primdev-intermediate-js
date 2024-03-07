import { Router } from "express";
import {
  createBook,
  deleteBook,
  editBook,
  getAllBooks,
  getOneBookById,
} from "../controllers/book-controller.js";
import upload from "../middlewares/multer.js";
import imgValidate from "../middlewares/imageValidation.js";

const bookRoute = Router();

//get All Books
bookRoute.get("/", getAllBooks);
//get One Book with id
bookRoute.get("/:id", getOneBookById);
//create Book
bookRoute.post(
  "/create",
  upload.single("sampul"),

  imgValidate,
  createBook
);
//edit Book
bookRoute.patch(
  "/edit/:id",

  upload.single("sampul"),
  imgValidate,
  editBook
);
//delete Book
bookRoute.delete("/delete/:id", deleteBook);

export default bookRoute;
