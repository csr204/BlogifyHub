import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import userContext from "../common/Context";

const NotificationCommentField = ({
  blog_id,
  blog_author,
  replyingTo = undefined,
  index = undefined,
  setReplying,
  notificationId,
  notificationData,
  notificationState,
}) => {
  let [commentTyped, setComment] = useState("");
  const {
    notificationState: { results },
    setNotificationState,
  } = notificationState;
  const { isLoggedIn } = useContext(userContext);
  const {
    message: { token },
  } = isLoggedIn;
  // console.log(token);
  // console.log(blog_author);
  const commentHandler = async () => {
    //add comment ,we need  blog_author, comment, blog_id:(_id of blog), replyingTo(comment to which current user is replying)
    //here blog_author is user himself
    if (!commentTyped.length) {
      toast.error("comment should have atleast one charcter");
    }
    // console.log("adding");
    try {
      const response = await fetch("http://localhost:3000/blogs/add-comment", {
        method: "POST",
        body: JSON.stringify({
          blog_author,
          comment: commentTyped,
          blog_id,
          replyingTo,
          notificationId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { message: data } = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }
      const { comment: comment, _id, commentedAt } = data;
      // results[index].reply = { reply, _id, commentedAt };
      console.log(results[index]);
      const newOne = [...results];
      newOne[index] = {
        ...newOne[index],
        reply: { commentedAt, comment, _id },
      };
      setReplying(false);
      setNotificationState((prev) => {
        return { ...prev, results: newOne };
      });
      // console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <Toaster />
      <textarea
        placeholder="leave a reply.."
        className="input-box pl-5 placeholder:text-dark-grey overflow-auto resize-none h-[150px] "
        value={commentTyped}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className="btn-dark px-10 mt-5" onClick={commentHandler}>
        reply
      </button>
    </div>
  );
};

export default NotificationCommentField;
