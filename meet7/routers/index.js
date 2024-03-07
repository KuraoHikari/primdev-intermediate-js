import { Router } from "express";
import userRoute from "./user-router.js";
import profileRoute from "./profile-router.js";
import likeRoute from "./like-router.js";
import bookRoute from "./book-router.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use("/user", userRoute);

router.use(authMiddleware);
router.use("/profile", profileRoute);
router.use("/book", bookRoute);
router.use("/like", likeRoute);

export default router;
