import {
  addArticle,
  getAllArticles,
  getArticleById,
  addClap,
  addComment,
  updateArticle,
} from "../controllers/articleControllers.js";

import multipart from "connect-multiparty";
const multipartWare = multipart();
import express from "express";

const router = express.Router();

router.route("/").get(getAllArticles);
router.route("/add").post(addArticle);
// Should protect this later
router.route("/:id").get(getArticleById).put(updateArticle);
router.route("/:id/clap").post(addClap);
router.route("/:id/comment").post(addComment);

export default router;
