import React, { useContext, useEffect, useState } from "react";
import { blogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import toast, { Toaster } from "react-hot-toast";
import Nodata from "./nodata.component";
import AnimationWrapper from "../common/AnimationWrapper";
import CommentCard from "./comment-card.component";
export const fetchComments = async ({
  skip = 0,
  commentsArray = null,
  blog_id,
  setParentCommentsFun,
}) => {
  // console.log(skip, blog_id);
  let res;
  try {
    const response = await fetch("http://localhost:3000/blogs/get-comments", {
      method: "POST",
      body: JSON.stringify({ blog_id, skip }),
      headers: { "Content-Type": "application/json" },
    });
    const commentResult = await response.json();
    commentResult.message.map((comment) => {
      comment.childrenLevel = 0;
    });
    setParentCommentsFun((prev) => prev + commentResult.message.length);
    if (commentsArray === null) {
      res = commentResult.message;
    } else {
      res = [...commentsArray, ...commentResult.message];
    }
    return res;
  } catch (err) {
    toast.error(err.message);
  }
};
const CommentWrapper = () => {
  const {
    commentWrapper,
    setCommentWrapper,
    blog,
    setBlog,
    setTotalParentComments,
    totalParentComments,
  } = useContext(blogContext);

  const { _id, comments, activity } = blog;
  const { total_parent_comments } =
    activity != undefined
      ? activity
      : { total_comments: 0, total_parent_comments: 0 };
  const loadMoreHandler = async () => {
    // console.log(comments);
    const newComments = await fetchComments({
      skip: totalParentComments,
      commentsArray: comments,
      blog_id: _id,
      setParentCommentsFun: setTotalParentComments,
    });
    // console.log(newComments);
    setBlog({ ...blog, comments: [...newComments] });
  };
  return (
    <div
      className={`max-sm:w-full fixed duration-700 sm:right-0 top-0 w-[25%] min-w-[300px] p-8 px-8 overflow-y-auto overflow-x-hidden shadow-2xl h-full bg-white no-scrollbar z-50 ${
        commentWrapper ? "" : "hidden"
      }`}
    >
      <Toaster />
      <h4 className="capitalize font-medium text-[14px] pb-2">Comments</h4>
      <h1 className="capitalize font-bold text-[12px] text-dark-grey line-clamp-1">
        {blog.title}
      </h1>
      <i
        className="ri-close-line text-black absolute top-2 right-2 text-2xl cursor-pointer"
        onClick={() => setCommentWrapper(false)}
      ></i>
      <hr className="w-full text-grey m-3 mb-5"></hr>
      <CommentField action={"comment"} />
      {/* {console.log("comments:", comments)} */}
      {comments !== undefined ? (
        comments.length > 0 ? (
          <>
            {comments.map((comment, i) => {
              return (
                <AnimationWrapper key={i}>
                  <CommentCard
                    comment={comment}
                    index={i}
                    leftVal={comment.childrenLevel * 4}
                  />
                </AnimationWrapper>
              );
            })}
            {/* {console.log(totalParentComments, " ", total_parent_comments)} */}
            {totalParentComments < total_parent_comments && (
              <button
                className="btn-dark px-4 text-[10px] py-2"
                onClick={loadMoreHandler}
              >
                Load more
              </button>
            )}
          </>
        ) : (
          <Nodata message={"No comments"} />
        )
      ) : (
        <Nodata message={"No comments"} />
      )}
    </div>
  );
};

export default CommentWrapper;
