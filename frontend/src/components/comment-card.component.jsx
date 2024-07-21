import React, { useContext, useState } from "react";
import DateUtensils from "../common/date";
import userContext from "../common/Context";
import toast from "react-hot-toast";
import CommentField from "./comment-field.component";
import { blogContext } from "../pages/blog.page";
const CommentCard = ({ index, leftVal, comment }) => {
  const {
    comment: commentText,
    commentedAt,
    commented_by: {
      personal_info: { username, profile_img },
    },
    _id,
    replies,
  } = comment;
  const {
    blog: { comments, activity },
    setBlog,
    blog,
    setTotalParentComments,
    totalParentComments,
  } = useContext(blogContext);
  const [isReplying, setIsReplying] = useState(false);
  const {
    author: {
      personal_info: { username: blogAuthor },
    },
    activity: { total_parent_comments, total_comments },
  } = blog;
  // console.log(blog);
  const {
    isLoggedIn,
    isLoggedIn: {
      message: { token },
    },
  } = useContext(userContext);
  const findParent = () => {
    let start = index - 1;
    try {
      while (comment.childrenLevel == comments[start].childrenLevel) {
        start--;
      }
    } catch {
      //the comment doesnot have a parent
      start = undefined;
    }
    return start;
  };
  const replyHandler = () => {
    if (!token) {
      return toast.error("login to reply");
    }
    setIsReplying((prev) => !prev);
  };
  const {
    message: {
      user: { username: currentUser, profile_img: user_profile_img, fullname },
    },
  } = isLoggedIn;
  const hideReplies = (start, deleteFlag = false) => {
    while (
      comments[start] &&
      comments[start].childrenLevel > comment.childrenLevel
    ) {
      comments.splice(start, 1);
    }
    if (deleteFlag) {
      // console.log("delete");
      toast.success("deleted");
      //if the deleted one is a reply(remove this from it's parent's replies arr) and also(not required) clear all replies of this comment
      //for finding parent comment
      const parent = findParent();
      if (parent >= 0) {
        comments[parent].replies = comments[parent].replies.filter((reply) => {
          return reply != _id;
        });
        console.log(comments[parent].replies);
        if (comments[parent].replies.length === 0) {
          comments[parent].isReplyLoaded = false;
        }
      }
      comments.splice(index, 1);
    }
    if (comment.childrenLevel === 0 && deleteFlag) {
      setTotalParentComments((prev) => prev - 1);
    }
    // console.log(totalParentComments);
    setBlog({
      ...blog,
      comments: comments,
      activity: {
        ...activity,
        total_parent_comments:
          total_parent_comments - (deleteFlag && comment.childrenLevel === 0)
            ? 1
            : 0,
      },
    });
  };
  const hideRepliesHandler = () => {
    comment.isReplyLoaded = false;
    hideReplies(index + 1);
  };
  const showRepliesHandler = async ({ skip = 0 }) => {
    // console.log(skip);
    const parent = findParent();
    // console.log(comments[parent]);
    hideReplies();
    if (replies.length || skip) {
      const response = await fetch(
        import.meta.env.VITE_SERVER + "/blogs/get-replies",
        {
          method: "POST",
          body: JSON.stringify({
            _id: skip ? comments[parent]._id : _id,
            skip,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const { message: replies } = await response.json();
      comment.isReplyLoaded = skip ? comment.isReplyLoaded : true;
      // console.log(replies);
      for (let i = 0; i < replies.length; i++) {
        replies[i].childrenLevel = skip
          ? comment.childrenLevel
          : comment.childrenLevel + 1;
        comments.splice(index + 1 + i, 0, replies[i]);
      }

      setBlog({ ...blog, blog: { comments: { ...comments } } });
    }
  };
  const deleteCommentHandler = (e) => {
    e.target.setAttribute("disabled", true);
    fetch(import.meta.env.VITE_SERVER + "/blogs/delete-comment", {
      method: "POST",
      body: JSON.stringify({ _id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        e.target.removeAttribute("diabled");
        hideReplies(index + 1, true);
      })
      .catch((err) => toast.error(err.message));
  };
  const Button = ({ parent }) => {
    return (
      <>
        {comments[parent].replies.length > 5 && (
          <button
            className="btn-dark text-[10px] px-4 py-2"
            onClick={() => {
              showRepliesHandler({ skip: index - parent });
            }}
          >
            load more replies
          </button>
        )}
      </>
    );
  };
  const LoadMoreReplies = () => {
    const parent = findParent();
    if (comments[parent + 1]) {
      // console.log(comments[parent]);
      // console.log(comments);
      // console.log(index);
      while (
        comments[index + 1] &&
        comments[index + 1].childrenLevel < comments[index].childrenLevel &&
        comments[parent].replies.length > index - parent
      ) {
        return <Button parent={parent} />;
      }
    }
    if (
      parent >= 0 &&
      comments[parent].replies.length > index - parent &&
      index == comments.length - 1
    ) {
      // console.log(comments[parent].replies.length, index - parent)
      return <Button parent={parent} />;
    }
  };
  return (
    <>
      <div className="w-full mb-2" style={{ paddingLeft: `${leftVal * 6}px` }}>
        <div className="border p-6 my-5 rounded-md">
          <div className="flex gap-3 ">
            <img src={profile_img} className="w-6 h-6 rounded-full"></img>
            <h4 className="line-clamp-1">@{username}</h4>
            <h5 className="max-w-fit">{DateUtensils.getDate(commentedAt)}</h5>
          </div>
          <p className="text-gelasio text-xl mt-4">{commentText}</p>
          <div className="flex gap-4 mt-1 pt-2 items-center">
            <p className="underline cursor-pointer" onClick={replyHandler}>
              reply
            </p>
            {comment.isReplyLoaded ? (
              <button onClick={hideRepliesHandler} className="underline">
                hide replies
              </button>
            ) : replies.length > 0 ? (
              <button onClick={showRepliesHandler} className="underline">
                {replies.length} replies
              </button>
            ) : (
              ""
            )}
            {currentUser === username || blogAuthor === currentUser ? (
              <button
                className="mr-0 ml-auto w-8 h-8 rounded-full bg-grey flex justify-center items-center cursor-pointer hover:bg-red/30"
                onClick={deleteCommentHandler}
              >
                <i className="ri-delete-bin-2-line text-[16px]"></i>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        {isReplying && (
          <div className="mt-3">
            <CommentField
              action={"reply"}
              replyingTo={_id}
              setReplyingTo={setIsReplying}
              index={index}
            />
          </div>
        )}
        {/* should be rendered only when replies>maxLimit(5) and below the last reply */}
        <LoadMoreReplies />
      </div>
    </>
  );
};

export default CommentCard;
