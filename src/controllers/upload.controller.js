import streamifier from "streamifier";
import cloudinary, { CLOUDINARY_FOLDER } from "../utils/cloudinary.js";

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uploadCertificate(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const studentSlug = slugify(req.body?.studentName || "student");
    const courseSlug = slugify(req.body?.courseName || "");
    const assetTypeSlug = slugify(req.body?.assetType || "file");
    const suffix = Date.now();
    const publicId = [studentSlug, courseSlug, assetTypeSlug, suffix]
      .filter(Boolean)
      .join("_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: "auto",
        public_id: publicId,
        use_filename: false,
        unique_filename: false,
        overwrite: false
      },
      (error, result) => {
        if (error) return next(error);
        return res.json({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    return null;
  } catch (err) {
    return next(err);
  }
}
