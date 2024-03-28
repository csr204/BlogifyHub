import React, { useContext } from "react";
import dateUtensils from "../common/date";
import { Link } from "react-router-dom";
import userContext from "../common/Context";
const Trending = ({ blogDetails, index }) => {
  const { darkMode } = useContext(userContext);
  const { blogId, title, publishedAt } = blogDetails;
  // console.log(blogDetails.author);
  const { username, profile_img } = blogDetails.author.personal_info;
  return (
    <Link className="flex gap-7 mt-7" to={`blog/${blogId}`}>
      <h1 className={`blog-index ${!darkMode ? " text-black " : "text-white"}`}>
        {"0" + (index + 1)}
      </h1>
      <div className="w-full">
        <Link className="flex gap-2 w-full" to={`/user/${username}`}>
          <img src={profile_img} className="w-6 h-6 rounded-full"></img>
          <p>@{username}</p>
          <p className="mr-3 ml-auto  px-3">
            {dateUtensils.formatDate(publishedAt)}
          </p>
        </Link>
        <p className="blog-title mt-2">{title}</p>
      </div>
    </Link>
  );
};

export default Trending;
