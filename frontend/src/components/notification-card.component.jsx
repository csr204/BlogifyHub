import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DateUtilities from "../common/date";
import NotificationCommentField from "./notification-comment-field.component";
import userContext from "../common/Context";
const NotificationCard = ({ notification, index, state }) => {
  const {
    user: {
      personal_info: { fullname, username, profile_img },
    },
    type,
    replied_on_comment,
    comment,
    blog: { title, blogId, _id },
    createdAt,
    _id: notificationId,
    reply,
    notification_for: { _id: user_id },
    seen,
  } = notification;
  const [isReplying, setIsReplying] = useState(false);
  // console.log(comment);
  const { isLoggedIn, setIsLoggedIn } = useContext(userContext);
  // const { newNotificationAvailable } = isLoggedIn;
  // "Cannot update a component (App) while rendering a different component (NotificationCard)," typically occurs when a component triggers a state update in its parent component while it's being rendered. This can lead to unexpected behavior and update loops in React.
  //hence useEffect is used
  useEffect(() => {
    setIsLoggedIn((prev) => {
      return { ...prev, newNotificationAvailable: false };
    });
  }, []);
  const {
    message: { token },
  } = isLoggedIn;
  const {
    message: {
      user: { profile_img: userProfileImage, username: userNameOfAuthor },
    },
  } = isLoggedIn;
  const { commentText, _id: commentId } = comment
    ? comment
    : { commentText: "", _id: "" };
  const {
    notificationState: { results, totalDocs, deletedDocCount },
    setNotificationState,
  } = state;
  const replyHandler = () => {
    setIsReplying((prev) => !prev);
  };
  // console.log(notification);
  const deleteHandler = async (e, commentId, type) => {
    e.target.setAttribute("disabled", true);
    try {
      const response = await fetch(
        "http://localhost:3000/blogs/delete-comment",
        {
          method: "POST",
          body: JSON.stringify({ _id: commentId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message: data } = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }
      if (type === "comment") {
        const newResults = [...results];
        newResults.splice(index, 1);
        // console.log(results);
        setNotificationState((prev) => {
          return { ...prev, results: newResults };
        });
      } else {
        //type="reply" logic
        delete results[index].reply;
        setNotificationState((prev) => {
          return {
            ...prev,
            results: { results },
            totalDocs: totalDocs - 1,
            deletedDocCount: deletedDocCount + 1,
          };
        });
      }
      console.log(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      e.target.removeAttribute("disabled");
    }
  };
  return (
    <div
      className={` border-black ${seen ? "" : "border-l-2"} px-4 py-4 w-full`}
    >
      <div className="flex gap-3 w-full">
        <img src={profile_img} className="w-12 h-12 rounded-full"></img>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <span className="max-md:hidden text-dark-grey inline-block">
              {fullname}
            </span>
            <p className="text-dark-grey">@{username}</p>
            <p className="ml-3">
              {type === "like"
                ? "liked your blog"
                : type === "comment"
                ? "commented on your blog"
                : "replied to"}
            </p>
          </div>
          {type === "reply" ? (
            <div className="bg-grey px-2 pl-4 py-4 text-left max-md:w-[320px] rounded-md max-w-[550px] line-clamp-1">
              {replied_on_comment.comment}
            </div>
          ) : type === "comment" ? (
            <Link
              to={`/blog/${blogId}`}
              className="underline mt-2 line-clamp-1 cursor-pointer"
            >
              {title}
            </Link>
          ) : (
            <Link
              to={`/blog/${blogId}`}
              className="underline mt-2 line-clamp-1 cursor-pointer"
            >
              {title}
            </Link>
          )}
          {type != "like" ? (
            <div>
              <p className="mt-2">
                {type === "reply" ? "replied:" : "user comment:"}{" "}
                {comment.comment}
              </p>
            </div>
          ) : (
            ""
          )}
          <div className="flex gap-4 mb-2 mt-1 items-center">
            <p className="text-dark-grey text-[12px]">
              {DateUtilities.getDate(createdAt)}
            </p>
            {type != "like" ? (
              <>
                {reply ? (
                  ""
                ) : (
                  <p
                    className="underline text-[12px]  text-dark-grey hover:text-black cursor-pointer"
                    onClick={replyHandler}
                  >
                    Reply
                  </p>
                )}
                <p
                  className="underline text-[12px] text-dark-grey hover:text-black cursor-pointer"
                  onClick={(e) => {
                    deleteHandler(e, commentId, "comment");
                  }}
                >
                  Delete
                </p>
              </>
            ) : (
              ""
            )}
          </div>
          {isReplying ? (
            <NotificationCommentField
              blog_author={user_id}
              blog_id={_id}
              index={index}
              notificationId={notificationId}
              replyingTo={commentId}
              setReplying={setIsReplying}
              notificationState={state}
            />
          ) : (
            ""
          )}
          {/* {console.log(reply)} */}
          {reply ? (
            <div className="w-full bg-grey px-10 pl-4 py-5 mt-4">
              <div className="flex gap-3 flex-row">
                <img
                  src={userProfileImage}
                  className="w-10 h-10 rounded-full"
                ></img>
                <div className="flex flex-col">
                  <p className="text-dark-grey">
                    <Link className="underline text-black px-2">
                      @{userNameOfAuthor}
                    </Link>
                    replied to
                    <Link className="underline text-black px-2" to="">
                      @{username}
                    </Link>
                  </p>
                  <p className="mt-1 pl-2">{reply.comment}</p>
                  <p
                    className="underline text-[12px] text-dark-grey mt-2 ml-2 hover:text-black cursor-pointer"
                    onClick={(e) => {
                      deleteHandler(e, results[index].reply._id, "reply");
                    }}
                  >
                    Delete
                  </p>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
