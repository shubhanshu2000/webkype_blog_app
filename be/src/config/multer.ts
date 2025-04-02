import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Increased limit to 5 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
      return cb(
        new Error(
          "Please upload a valid image (PNG, JPG, JPEG, GIF, WebP, SVG)"
        )
      );
    }
    cb(null, true);
  },
});

export { imageUpload };
