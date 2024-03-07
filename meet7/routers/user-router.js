import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user-controller.js";

const userRoute = Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);

export default userRoute;
