import addArticle from "../controllers/articleControllers.js";

import multipart from "connect-multiparty";
const multipartWare = multipart();
import express from "express";

const router = express.Router();

router.route("/article").post(multipartWare, addArticle);

export default router;
