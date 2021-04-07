import Article from "../models/articleModel.js";
import User from "../models/usersModel.js";

import fs from "fs";
import cloudinary from "cloudinary";

const addArticle = async (req, res, next) => {
  let { title, text, claps, description } = req.body;

  if (req.files.image) {
    cloudinary.uploader.upload(
      req.files.image.path,
      (result) => {
        let obj = {
          title,
          text,
          claps,
          description,
          feature_img: result.url !== null ? result.url : "",
        };
        saveArticle(obj);
      },
      {
        resource_type: "image",
        eager: [{ effect: "sepia" }],
      },
    );
  } else {
    saveArticle({ text, title, claps, description, feature_img: "" });
  }

  async function saveArticle(obj) {
    const article = await new Article(obj);

    await article.save();

    try {
      return article.addAuthor(req.body.author_id);
    } catch (error) {
      res.status(400);
      throw new Error(error);
    }
  }
};

export default addArticle;
