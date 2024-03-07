import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
export async function handleUpload(file) {
  const res = await cloudinary.v2.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}
