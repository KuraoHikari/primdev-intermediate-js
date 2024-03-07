import jwt from "jsonwebtoken";
import "dotenv/config";

export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.access_token;

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      res.status(401).json({ message: "Unauthicated" });
    } else {
      req.user = verifyToken;

      next();
    }
  } catch (error) {
    console.log("🚀 ~ getAllBooks ~ error:", error);

    res.status(401).json({ message: "Unauthicated" });
  }
}
