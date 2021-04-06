import express from "express";
import methodOverride from "method-override";
import Article from "./models/article.js";
import articleRoute from "./routes/articleRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRoute);

app.listen(5000);
