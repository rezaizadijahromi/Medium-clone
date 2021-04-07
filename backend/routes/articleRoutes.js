import {
  addArticle,
  getAllArticles,
  getArticleById,
} from "../controllers/articleControllers.js";

import multipart from "connect-multiparty";
const multipartWare = multipart();
import express from "express";

const router = express.Router();

router.route("/add").post(multipartWare, addArticle);
router.route("/").get(multipartWare, getAllArticles);
router.route("/:id").get(multipartWare, getArticleById);

export default router;
