import { Router } from "express";
import {
  createTag,
  deleteTag,
  editTag,
  listTags,
} from "../controllers/tagController.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verifyToken, authorizeRoles("ADMIN"), listTags);
router.post("/create", verifyToken, authorizeRoles("ADMIN"), createTag);
router.patch("/:id/edit", verifyToken, authorizeRoles("ADMIN"), editTag);
router.delete("/:id/delete", verifyToken, authorizeRoles("ADMIN"), deleteTag);

export default router;
