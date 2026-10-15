import { v2 as cloudinary } from "cloudinary";
import type { UploadedFile } from "express-fileupload";

// Uploads an image to Cloudinary (configured via CLOUDINARY_URL) and returns its HTTPS URL.
// Overwrites any earlier upload with the same publicId.
const uploadImage = async (file: UploadedFile, publicId: string): Promise<string> => {
  // The SDK caches its config when first imported, before server.ts has loaded config.env, so
  // re-read CLOUDINARY_URL from the environment (config(true)) before every upload
  cloudinary.config(true);
  cloudinary.config({ secure: true });

  const dataUri = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    public_id: publicId,
    folder: "learnhub/academies",
    overwrite: true,
    resource_type: "image",
  });
  return result.secure_url;
};

export default uploadImage;
