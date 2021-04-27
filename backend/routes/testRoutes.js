import express from "express";
import { testPost } from "../controllers/testControllers.js";

const router = express.Router();

router.route("/").get(testPost);

export default router;
