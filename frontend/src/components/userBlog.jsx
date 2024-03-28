import React from "react";
import { Link } from "react-router-dom";

const UserBlog = ({ details }) => {
  // details is an array of objects
  // console.log("details:", details);
  return (
    <>
      <h3 className="pl-10 text-[12px]">User Blogs</h3>
      {details.map((blog, index) => {
        return (
          <div key={index}>
            <Link
              className="w-full flex gap-6 max-h-fit px-10 py-10"
              to={`/blog/${blog.blogId}`}
            >
              <div>
                <img
                  src={blog.banner}
                  className="w-20 h-20 rounded-sm object-cover"
                ></img>
              </div>
              <div className="w-full">
                <h1 className="text-[16px] font-bold">{blog.title}</h1>
                <p>{blog.des}</p>
                <div className="flex w-full mt-2 gap-10">
                  <div className="flex gap-2">
                    <i className="ri-heart-3-line"></i>
                    <p>{blog.activity.total_likes}</p>
                  </div>
                  <div className="flex gap-2">
                    <i className="ri-eye-line"></i>
                    <p>{blog.activity.total_reads}</p>
                  </div>
                </div>
              </div>
            </Link>
            <hr className="w-full text-grey"></hr>
          </div>
        );
      })}
    </>
  );
};

export default UserBlog;
