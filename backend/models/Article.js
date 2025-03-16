import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    tag: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    textenCopy: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
