import React, { useContext, useEffect, useState } from "react";
import userContext from "../common/Context";
import NotificationCard from "../components/notification-card.component";
import AnimationWrapper from "../common/AnimationWrapper";
import Nodata from "../components/nodata.component";
import Loader from "../components/loader.component";
const filters = ["all", "like", "comment", "reply"];
const Notification = () => {
  const { isLoggedIn } = useContext(userContext);
  const {
    message: { token },
    newNotificationAvailable,
  } = isLoggedIn;
  const [curFilter, setFilter] = useState("all");
  const [notificationState, setNotificationState] = useState(null);
  const [page, setPage] = useState(1);
  const [deletedDocCount, setDeletedDocCount] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const filterHandler = (e) => {
    const btn = e.target;
    setFilter(btn.innerHTML);
  };
  // console.log(token, newNotificationAvailable);
  const fetchNotifications = async () => {
    if (token) {
      setIsloading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/blogs/notifications",
          {
            method: "POST",
            body: JSON.stringify({ filter: curFilter, page, deletedDocCount }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { message: data, totalDocs } = await response.json();

        if (!response.ok) {
          throw new Error(data);
        }
        console.log(data);
        setIsloading(false);
        setNotificationState({
          results: { ...results, data },
          deletedDocCount,
          totalDocs,
        });
      } catch (err) {
        setIsloading(false);
        console.log(err.message);
      }
    }
  };
  const loadMoreHandler = () => {
    setPage((prev) => prev + 1);
  };
  useEffect(() => {
    fetchNotifications();
  }, [curFilter, page]);
  // console.log(isLoading);
  return (
    <div className="mt-2">
      <div className="flex gap-2 ">
        {filters.map((filter, i) => {
          return (
            <button
              key={i}
              className={`px-6 py-2 text-[14px] ${
                curFilter == filter ? "btn-dark" : "btn-light"
              }`}
              onClick={filterHandler}
            >
              {filter}
            </button>
          );
        })}
      </div>
      {isLoading ? (
        <Loader />
      ) : notificationState &&
        notificationState.results &&
        notificationState.results.length ? (
        <>
          <div className="mt-10 flex flex-col gap-3 w-full">
            {/* render notifications */}
            {/* {console.log(notificationState)} */}
            {notificationState.results.map((notification, index) => {
              return (
                <AnimationWrapper key={index}>
                  <NotificationCard
                    index={index}
                    notification={notification}
                    state={{
                      notificationState,
                      setNotificationState,
                    }}
                  />
                </AnimationWrapper>
              );
            })}
            {/* notificationState:{results: Array(1), deletedDocCount: 0, totalDocs: 1} */}
            {notificationState.totalDocs > 5 && (
              <button onClick={loadMoreHandler}>Load more</button>
            )}
          </div>
        </>
      ) : (
        <Nodata
          message={
            curFilter != "all"
              ? curFilter === "reply"
                ? "No replies"
                : `No ${curFilter}s`
              : "No notifications"
          }
        />
      )}
    </div>
  );
};

export default Notification;
