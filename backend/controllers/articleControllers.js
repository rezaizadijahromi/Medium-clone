import Article from "../models/articleModel.js";
import User from "../models/usersModel.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import cloudinary from "cloudinary";

// const addArticle = asyncHandler(async (req, res, next) => {
//   let { title, text, claps, description } = req.body;

//   if (req.files.image) {
//     cloudinary.uploader.upload(
//       req.files.image.path,
//       (result) => {
//         let obj = {
//           title,
//           text,
//           claps,
//           description,
//           feature_img: result.url !== null ? result.url : "",
//         };
//         saveArticle(obj);
//       },
//       {
//         resource_type: "image",
//         eager: [{ effect: "sepia" }],
//       },
//     );
//   } else {
//     saveArticle({ text, title, claps, description, feature_img: "" });
//   }

//   async function saveArticle(obj) {
//     const article = await new Article(obj);

//     await article.save();

//     try {
//       return article.addAuthor(req.body.author_id);
//     } catch (error) {
//       res.status(400);
//       throw new Error(error);
//     }
//   }
// });

const addArticle = asyncHandler(async (req, res) => {
  const { title, text, claps, description, feature_img } = req.body;

  if (feature_img === "") {
    feature_img = "";
  }

  const article = new Article({
    title,
    text,
    claps,
    description,
    feature_img,
  });

  if (article) {
    const newArticle = await article.save();
    res.status(201).json(article);
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

export { addArticle, getAllArticles, getArticleById };
