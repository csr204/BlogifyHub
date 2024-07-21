import React, { useContext, useState } from "react";
import userContext from "../common/Context";
import { blogContext } from "../pages/blog.page";
import toast from "react-hot-toast";

const CommentField = ({
  action,
  index,
  replyingTo = undefined,
  setReplyingTo = undefined,
}) => {
  const [comment, setComment] = useState();
  const { blog, setBlog, setTotalParentComments } = useContext(blogContext);
  const userCtx = useContext(userContext);
  const { author, _id, comments, activity } = blog;
  const { total_comments, total_parent_comments } =
    activity != undefined
      ? activity
      : { total_comments: 0, total_parent_comments: 0 };
  const commentHandler = () => {
    if (!userCtx.isLoggedIn.message.token) {
      return toast.error("Login to comment");
    }
    const {
      message: { user },
    } = userCtx.isLoggedIn;
    // console.log(comment);
    if (comment == undefined || !comment.length) {
      return toast.error("comment should atleast have 1 letter");
    }
    // console.log("replying to:", replyingTo);
    fetch(import.meta.env.VITE_SERVER + "/blogs/add-comment", {
      method: "POST",
      body: JSON.stringify({
        blog_author: author,
        comment: comment,
        blog_id: _id,
        replyingTo,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userCtx.isLoggedIn.message.token}`,
      },
    }).then((response) => {
      response
        .json()
        .then((result) => {
          // console.log(result);
          setComment("");
          let parentCommentIncrementVal = replyingTo ? 0 : 1;
          let newComments;
          result.message.commented_by = { personal_info: user };
          if (replyingTo) {
            comments[index].replies.push(result.message._id);
            // console.log(comments[index]);
            result.message.parentIndex = index;
            //attribute to check if a particular comment has a reply or not
            comments[index].isReplyLoaded = true;
            result.message.childrenLevel = comments[index].childrenLevel + 1;
            //[1,2,3] replying 4 to 2  [1,2,4,3]  so use splice
            comments.splice(index + 1, 0, result.message);
            newComments = comments;
          } else {
            result.message.childrenLevel = 0;
            newComments = [result.message, ...comments];
            // comments.pop();
          }
          //hide replies if replies length is greater than 5
          if (replyingTo && comments[index].replies.length > 5) {
            // console.log(comments);
            comments.splice(index + 6, 1);
          }
          if (setReplyingTo) {
            setReplyingTo(false);
          }
          // console.log(newComments);
          setBlog({
            ...blog,
            comments: newComments,
            activity: {
              ...activity,
              total_comments: total_comments + 1,
              total_parent_comments:
                total_parent_comments + parentCommentIncrementVal,
            },
          });
          setTotalParentComments((prev) => prev + parentCommentIncrementVal);
        })
        .catch((err) => toast.error(err.message));
    });
  };

  return (
    <>
      <textarea
        placeholder={`Leave a ${action}...`}
        className="input-box pl-5 h-[120px] resize-none overflow-auto"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button
        className={`btn-dark mt-3 px-6 py-2 text-[12px] mb-6`}
        onClick={commentHandler}
      >
        {action}
      </button>
    </>
  );
};

export default CommentField;
