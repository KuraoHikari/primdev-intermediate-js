import multer from "multer";

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

export default upload;
