const { mongoose, Schema } = require("mongoose");
//who commented,blog, comment
const commentSchema = new mongoose.Schema(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      ref: "blogs",
      required: true,
    },
    blog_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "blogs",
    },
    comment: {
      type: String,
      required: true,
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    isReply: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "commentedAt",
    },
  }
);
module.exports = mongoose.model("comments", commentSchema);
