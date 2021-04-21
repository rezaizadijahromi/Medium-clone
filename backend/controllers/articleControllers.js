import Article from "../models/articleModel.js";
import User from "../models/usersModel.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import cloudinary from "cloudinary";

const addArticle = asyncHandler(async (req, res) => {
  const { title, text, claps, description, feature_img, tag } = req.body;

  const user = await User.findById(req.user._id);
  const authore = {
    name: req.user.name,
    user: req.user._id,
  };
  const article = new Article({
    title,
    text,
    claps,
    description,
    feature_img,
    tag,
    author: authore,
  });

  if (article) {
    const newArticle = await article.save();
    // console.log(newArticle);
    res.status(201).json(newArticle);
  } else {
    res.status(400);
    throw new Error("Wrong data");
  }
});

const getAllArticles = asyncHandler(async (req, res) => {
  const article = await Article.find({});

  if (article.length > 0) {
    res.json(article);
  } else {
    res.status(404);
    throw new Error("No article found");
  }
  res.json(article);
});

const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id).populate(
    "author comments.author",
  );

  if (article) {
    res.json(article);
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

const updateArticle = asyncHandler(async (req, res) => {
  const { title, text, claps, description, feature_img } = req.body;
  const article = await Article.findById(req.params.id);
  const user = await User.findById(req.user._id);

  console.log(user._id);
  console.log(article.author.user);

  if (user._id.toString() === article.author.user.toString()) {
    if (article) {
      article.title = title || article.title;
      article.text = text || article.text;
      article.description = description || article.description;
      article.feature_img = feature_img || article.feature_img;
    } else {
      res.status(404);
      throw new Error("Article not found");
    }

    const articleUpdated = await article.save();

    res.json(articleUpdated);
  } else {
    throw new Error("You are not author of this article");
  }
});

const addClap = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article) {
    console.log(article);
    await article.clap();
    res.json(article);
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

const addComment = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const article = await Article.findById(req.params.id);

  if (article) {
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    console.log(article);
    article.reviews.push(review);
    await article.save();
    res.status(201).json({ message: "comment added" });
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

// @desc    Delete a article
// @route   DELETE /api/articles/:id
// @access  Private

const deleteArticle = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const article = await Article.findById(req.params.id);

  if (user._id.toString() === article.author.user.toString()) {
    if (article) {
      await article.remove();
      res.json({ message: "Article removed" });
    } else {
      throw new Error("Article not found");
    }
  } else {
    throw new Error("You are not the author of this article");
  }
});

export {
  addArticle,
  getAllArticles,
  getArticleById,
  deleteArticle,
  addClap,
  addComment,
  updateArticle,
};
