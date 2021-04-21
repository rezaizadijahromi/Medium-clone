import mongoose from "mongoose";
import marked from "marked";
import slugify from "slugify";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";
import mongoosePaginate from "mongoose-paginate-v2";

const dompurify = createDomPurify(new JSDOM().window);

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ArticleSchema = mongoose.Schema({
  text: String,
  title: String,
  description: String,
  feature_img: {
    type: String,
    default: "",
  },
  claps: {
    type: Number,
    default: 0,
  },
  tag: {
    type: String,
    default: "",
  },
  author: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
  },
  reviews: [reviewSchema],
});

ArticleSchema.methods.clap = function () {
  this.claps += 1;
  return this.save();
};

// ArticleSchema.methods.comment = function (c) {
//   this.comments.push(c);
//   return this.save();
// };

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
