import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ users }) => {
  //users is an array of objs
  // console.log(users);
  return (
    <div className="flex flex-col justify-center mt-10 bottom-2 gap-8">
      {users.map((user, i) => {
        let fullname = user.personal_info.email.split("@")[0];
        return (
          <Link
            className="flex flex-col custom:flex-row gap-2 px-5 py-4 items-center md:gap-4 border-2 border-grey border-solid rounded-lg"
            key={i}
            to={`../user/${user.personal_info.username}`}
          >
            <img
              src={user.personal_info.profile_img}
              className="w-11 h-11 rounded-full"
            ></img>
            <div className="">
              <h1 className="text-xl font-semibold mt-2 custom:mt-auto">
                @{fullname}
              </h1>
              <h1 className="text-[14px] custom:text-[12px]">
                {user.personal_info.username}
              </h1>
            </div>
            <div className="custom:mr-2 custom:ml-auto">
              <i className="ri-article-fill"></i>
              <span>Total posts:{user.info.total_posts}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default UserCard;
