import mongoose from "mongoose";
import marked from "marked";
import slugify from "slugify";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";
import mongoosePaginate from "mongoose-paginate-v2";

const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  // sanitizedHtml: {
  //   type: String,
  //   required: true,
  // },
});

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });

    // if (this.markdown) {
    //   this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    // }

    next();
  }
});

// articleSchema.plugin(mongoosePaginate)
// module.exports = mongoose.model('Post', PostSchema);

articleSchema.plugin(mongoosePaginate);

const Article = mongoose.model("Article", articleSchema);
export default Article;
