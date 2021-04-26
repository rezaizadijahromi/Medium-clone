import express from "express";
import { testPost } from "../controllers/testControllers.js";

const router = express.Router();

// router.route("/post").post(testPost);
router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

export default router;
