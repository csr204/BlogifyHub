import { Link } from "react-router-dom";
import DateUtilities from "../common/date";
import { useContext, useEffect, useState } from "react";
import userContext from "../common/Context";
import toast from "react-hot-toast";

export const ManageDraft = ({ blog, index, setStateFunction }) => {
  const { title, blogId, des } = blog;
  const { isLoggedIn } = useContext(userContext);
  const {
    message: { token },
  } = isLoggedIn;
  const {
    draftsState: { blogs: results, deletedDocs },
    setDrafts,
  } = setStateFunction;
  const deleteHandler = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + "/blogs/delete-blog",
        {
          method: "POST",
          body: JSON.stringify({ blogId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message } = await response.json();
      if (!response.ok) throw new Error(message);
      // console.log(message);
      // console.log(results);
      // results.splice(index, 1);
      const newResults = [...results];
      newResults.splice(index, 1);
      // console.log(newResults);
      setDrafts((prev) => {
        return { ...prev, deletedDocs: deletedDocs + 1, blogs: newResults };
      });

      toast.success("deleted");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="flex gap-6 pb-6 border-b border-grey lg:gap-10 mb-2 mt-4">
      <h1 className="blog-index text-centerpl-4 md:pl-6 flex-none">
        {index < 110 ? "0" + index : index}
      </h1>
      <div>
        <h1 className="blog-title mb-3 font-sans">{title}</h1>
        <p className="line-clamp-2 font-gelasio">
          {des.length ? des : "No Description"}
        </p>
        <div className="flex gap-4 mt-2">
          <Link className="underline pr-4 py-2" to={`/editor/${blogId}`}>
            edit
          </Link>
          <button
            className="text-red/60 hover:text-red/80 underline"
            onClick={deleteHandler}
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
};
const ManageBlogComponent = ({ blog, index, setStateFunction }) => {
  const { banner, blogId, title, publishedAt, activity: stats } = blog;
  const [showStats, setShowStats] = useState(false);
  const { isLoggedIn } = useContext(userContext);
  const {
    message: { token },
  } = isLoggedIn;
  const {
    blogsState: { blogs: results, deletedDocs },
    setBlogs,
  } = setStateFunction;

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setShowStats(true);
    } else {
      setShowStats(false);
    }
  }, []);
  const deleteHandler = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + "/blogs/delete-blog",
        {
          method: "POST",
          body: JSON.stringify({ blogId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message } = await response.json();
      if (!response.ok) throw new Error(message);
      // console.log(results);
      // results.splice(index, 1);
      const newResults = [...results];
      newResults.splice(index, 1);
      // console.log(newResults);
      setBlogs((prev) => {
        return { ...prev, deletedDocs: deletedDocs + 1, blogs: newResults };
      });
      toast.success("deleted");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="flex max-md:flex-col mb-3 mt-4 gap-10  border-b border-grey pb-5 items-center">
      <img
        src={banner}
        className="max-md:hidden lg-hidden xl:block flex-none w-28 h-28 object-cover"
      ></img>
      <div>
        <div className="flex flex-col gap-4 w-[300px]">
          <Link
            className="hover:underline text-[18px] font-sans font-bold capitalize"
            to={`/blog/${blogId}`}
          >
            {title}
          </Link>
          <p>published on:{DateUtilities.getDate(publishedAt)}</p>
          <div className="flex justify-between max-md:justify-normal max-md:gap-5">
            <Link className="underline" to={`/editor/${blogId}`}>
              edit
            </Link>
            <button
              className="text-red/60 hover:text-red/80 underline"
              onClick={deleteHandler}
            >
              delete
            </button>
            <button
              className="md:invisible underline"
              onClick={() => {
                setShowStats((prev) => !prev);
              }}
            >
              {showStats ? "hide stats" : "stats"}
            </button>
          </div>
        </div>
      </div>
      {showStats && (
        <div className="flex ml-auto mr-1 max-md:-ml-[62px] max-md:mt-0">
          {Object.keys(stats).map((stat, index) => {
            return stat.includes("parent") ? (
              ""
            ) : (
              <div
                className={
                  "flex flex-col items-center w-full h-full justify-center p-4 px-6 max-md:justify-normal" +
                  `${index != 0 ? "border-grey/20 border-l" : ""} `
                }
              >
                <h1 className="text-xl lg:text-2xl mb-2">
                  {stats[stat].toLocaleString()}
                </h1>
                <p className="max-lg:text-dark-grey capitalize ">
                  {stat.split("_")[1]}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageBlogComponent;
