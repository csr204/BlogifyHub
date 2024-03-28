import React, { useContext, useEffect, useState } from "react";
import { blogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";

import userContext from "../common/Context";
import toast, { Toaster } from "react-hot-toast";
const BlogInteraction = () => {
  const [liked, setLiked] = useState(false);
  const blogCtx = useContext(blogContext);
  const { setCommentWrapper, totalParentComments } = blogCtx;
  const {
    title,
    banner,
    blogId: blog_id,
    activity: { total_likes, total_comments, total_parent_comments },
    author: {
      personal_info: { username: author_username },
    },
    _id,
  } = blogCtx.blog;
  const sessiondetails = useContext(userContext);
  let username = "";
  if (sessiondetails.isLoggedIn.message.token != null) {
    username = sessiondetails.isLoggedIn.message.user.username;
  }
  //check if user has already liked
  useEffect(() => {
    if (username.length > 0) {
      fetch("http://localhost:3000/blogs/checklike", {
        method: "POST",
        body: JSON.stringify({ _id: _id }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessiondetails.isLoggedIn.message.token}`,
        },
      })
        .then((result) => {
          result
            .json()
            .then((res) => setLiked(res.message))
            .catch((err) => console.log(err));
          // setLiked(result);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [blog_id]);
  const likeHandler = () => {
    // console.log(_id);
    //check if user is authenticated
    if (username.length === 0) {
      return toast.error("signin to like the blog");
    }
    //increase like count in db,change color to red
    //if already liked decrease the count and retrace back to normal
    setLiked((prev) => {
      return !prev;
    });
    blogCtx.setBlog((prev) => {
      let { activity } = prev;
      let likesBefore = activity.total_likes;
      if (liked) likesBefore--;
      else likesBefore++;

      let newBlogState = {
        ...prev,
        activity: { ...activity, total_likes: likesBefore },
      };
      return newBlogState;
    });
    //update on backend
    fetch("http://localhost:3000/blogs/like", {
      method: "POST",
      body: JSON.stringify({ _id: _id, liked: liked }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessiondetails.isLoggedIn.message.token}`,
      },
    })
      .then((res) => {
        res
          .json()
          .then((result) => {
            console.log(result);
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mt-8">
      <Toaster />
      <hr className="text-grey"></hr>
      <div className="flex px-4 py-4 justify-between">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-grey flex items-center justify-center hover:cursor-pointer"
              onClick={likeHandler}
            >
              <i
                className={`text-2xl ${
                  liked ? "ri-heart-3-fill text-red" : "ri-heart-3-line"
                }`}
              ></i>
            </div>
            <h1>{total_likes}</h1>
          </div>
          <div
            className="flex items-center gap-3"
            onClick={() => {
              setCommentWrapper((prev) => !prev);
            }}
          >
            <div className="w-10 h-10 rounded-full bg-grey flex items-center justify-center hover:cursor-pointer">
              <i className="ri-message-3-line text-2xl"></i>
            </div>
            <h1>{totalParentComments}</h1>
          </div>
        </div>
        <div>
          {author_username === username && (
            <Link
              className="btn-light rounded-none py-2 px-6 mr-4 "
              to={`/editor/${blog_id}`}
            >
              Edit
            </Link>
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}
            target="_blank"
          >
            <i className="ri-twitter-fill hover:text-twitter text-2xl cursor-pointer"></i>
          </Link>
        </div>
      </div>
      <hr className="text-grey"></hr>
    </div>
  );
};

export default BlogInteraction;
