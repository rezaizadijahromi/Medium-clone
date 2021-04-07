import {
  addArticle,
  getAllArticles,
  getArticleById,
  addClap,
  addComment,
} from "../controllers/articleControllers.js";

import multipart from "connect-multiparty";
const multipartWare = multipart();
import express from "express";

const router = express.Router();

router.route("/").get(multipartWare, getAllArticles);
router.route("/add").post(multipartWare, addArticle);
router.route("/:id").get(multipartWare, getArticleById);
router.route("/:id/clap").post(multipartWare, addClap);
router.route("/:id/comment").post(multipartWare, addComment);

export default router;
