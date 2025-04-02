import { Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  deleteUser,
  getProfile,
  listUserBlogs,
  updateProfile,
} from "../controllers/userController.js";

const router = Router();

router.get("/profile", verifyToken, authorizeRoles("ADMIN"), getProfile);
router.get(
  "/profile/blogs",
  verifyToken,
  authorizeRoles("ADMIN"),
  listUserBlogs
);
router.patch(
  "/profile/edit",
  verifyToken,
  authorizeRoles("ADMIN"),
  updateProfile
);
router.delete(
  "/profile/delete",
  verifyToken,
  authorizeRoles("ADMIN"),
  deleteUser
);

export default router;
