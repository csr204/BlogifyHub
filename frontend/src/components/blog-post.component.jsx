import React from "react";
import dateUtensils from "../common/date";
import { Link } from "react-router-dom";

const BlogPost = ({ blogDetails }) => {
  const { blogId, des, title, banner, tags, publishedAt, activity } =
    blogDetails;
  const { username, profile_img } = blogDetails.author.personal_info;
  const userId = blogDetails.author;

  return (
    <Link
      to={`/blog/${blogId}`}
      className="flex items-center mb-2 border-b-2 border-b-grey"
    >
      <div className="w-full my-5">
        {/* warning */}
        <Link to={`/user/${username}`}>
          <div className="flex justify-start items-center gap-4 mb-5">
            <img src={profile_img} className="w-7 h-7 rounded-full"></img>
            <p className="text-xl line-clamp-1">@{username}</p>
            <p>{dateUtensils.formatDate(publishedAt)}</p>
          </div>
        </Link>
        <p className="blog-title capitalize mb-2">{title}</p>
        <p className="my-3 max-sm:hidden font-gelasio lg:line-clamp-3 leading-6 md:line-clamp-2 text-xl">
          {des}
        </p>
        {/* <img src={banner} className="w-[140px] object-cover"></img> */}
        <div className="flex gap-4 items-center mt-6">
          {tags.length > 0 && (
            <span className="btn-light py-2 px-4">{tags[0]}</span>
          )}
          <div className="flex ml-auto mr-14 gap-6">
            <div>
              <i className="ri-heart-3-line ml-3 text-xl mr-1"></i>
              <span className="text-xl">{activity.total_likes}</span>
            </div>
            <div>
              <i className="ri-eye-line ml-3 text-xl mr-1"></i>
              <span className="text-xl">{activity.total_reads}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-28 aspect-square">
        <img
          src={banner}
          className="w-full object-cover rounded-lg h-full"
        ></img>
      </div>
    </Link>
  );
};

export default BlogPost;
