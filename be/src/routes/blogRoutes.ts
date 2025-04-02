import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  listBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { imageUpload } from "../config/multer.js";

const router = Router();

router.get("/", verifyToken, authorizeRoles("ADMIN", "USER"), listBlogs);
router.get("/:id", verifyToken, authorizeRoles("ADMIN", "USER"), getBlogById);
router.post(
  "/create",
  verifyToken,
  imageUpload.single("image"),
  authorizeRoles("ADMIN"),
  createBlog
);
router.patch(
  "/:id/edit",
  verifyToken,
  imageUpload.single("image"),
  authorizeRoles("ADMIN"),
  updateBlog
);
router.delete("/:id/delete", verifyToken, authorizeRoles("ADMIN"), deleteBlog);

export default router;
