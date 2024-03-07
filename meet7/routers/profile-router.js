import { Router } from "express";
import {
  createUserProfile,
  editUserProfile,
  getUserProfile,
} from "../controllers/profile-controller.js";

const profileRoute = Router();

profileRoute.get("/me", getUserProfile);
profileRoute.post("/create", createUserProfile);
profileRoute.patch("/edit", editUserProfile);

export default profileRoute;
