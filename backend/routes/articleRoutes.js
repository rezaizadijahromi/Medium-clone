import {
  addArticle,
  getAllArticles,
  getArticleById,
  deleteArticle,
  addClap,
  addComment,
  updateArticle,
} from "../controllers/articleControllers.js";
import { protect, admin } from "../middlewares/authMiddleWare.js";

import multipart from "connect-multiparty";
const multipartWare = multipart();
import express from "express";

const router = express.Router();

router.route("/").get(getAllArticles);
router.route("/:id/clap").post(addClap);
// Should protect this later
router.route("/add").post(protect, addArticle);
router
  .route("/:id")
  .get(getArticleById)
  .put(protect, updateArticle)
  .delete(protect, deleteArticle);
router.route("/:id/review").post(protect, addComment);

export default router;
