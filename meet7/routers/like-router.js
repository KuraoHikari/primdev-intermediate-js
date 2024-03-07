import { Router } from "express";
import { likeBook } from "../controllers/like-controller.js";

const likeRoute = Router();

likeRoute.post("/:bookId", likeBook);
likeRoute.get("/:bookId");

export default likeRoute;
