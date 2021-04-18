import {
  addArticle,
  getAllArticles,
  getArticleById,
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
router.route("/:id").get(getArticleById).put(protect, updateArticle);
router.route("/:id/comment").post(protect, addComment);

export default router;
