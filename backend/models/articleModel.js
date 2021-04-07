import mongoose, { mongo } from "mongoose";
import marked from "marked";
import slugify from "slugify";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";
import mongoosePaginate from "mongoose-paginate-v2";

const dompurify = createDomPurify(new JSDOM().window);

let ArticleSchema = new mongoose.Schema({
  text: String,
  title: String,
  description: String,
  feature_img: String,
  claps: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: String,
    },
  ],
});

ArticleSchema.methods.clap = function () {
  this.clap++;
  return this.save();
};

ArticleSchema.methods.comments = function (c) {
  this.comments.push(c);
  return this.save();
};

ArticleSchema.methods.addAuthor = function (author_id) {
  this.author = author_id;
  return this.save();
};

ArticleSchema.methods.getUserArticle = async function (_id) {
  const article = await Article.find({ author: _id });
  return article;
};

const Article = mongoose.model("Article", ArticleSchema);
export default Article;
