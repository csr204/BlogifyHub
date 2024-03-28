// const mongoose = require("mongoose");
// //todo change default img link
// const blogSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   img: { type: String, default: "" },
//   author: { type: mongoose.Types.ObjectId, ref: "userSchema", required: true },
//   content: { type: String, required: true },
//   likes: { type: Number, default: 0 },
//   comments: { type: Number, default: 0 },
//   views: { type: Number, default: 0 },
//   keywords: [{ type: String, default: [] }],
// });
// module.exports = mongoose.model("blogs", blogSchema);
const { mongoose, Schema } = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    blogId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      // required: true,
    },
    des: {
      type: String,
      maxlength: 200,
      // required: true
    },
    content: {
      type: [],
      // required: true
    },
    tags: {
      type: [String],
      // required: true
    },
    author: {
      // type:mongoose.Types.ObjectId,
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
      },
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
    },
    draft: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

module.exports = mongoose.model("blogs", blogSchema);
