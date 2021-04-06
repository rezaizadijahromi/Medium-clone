import express from "express";
import methodOverride from "method-override";
import Article from "./models/article.js";
import articleRoute from "./routes/articleRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import passport from "passport";
import flash from "express-flash";

dotenv.config();

connectDB();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRoute);

app.listen(5000);
