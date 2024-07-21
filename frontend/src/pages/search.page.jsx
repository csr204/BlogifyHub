import React, { useEffect, useState } from "react";
import InpageNav from "../components/inpage-navigation.component";
import { useParams } from "react-router-dom";
import PageNav from "../components/PageNav";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/AnimationWrapper";
import Nodata from "../components/nodata.component";
import BlogPost from "../components/blog-post.component";
import { defaultBtnRef } from "../components/inpage-navigation.component";
import toast, { Toaster } from "react-hot-toast";
import UserCard from "../components/usercard.component";

const Search = () => {
  const { query } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [relatedUsers, setRelatedUsers] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalpages] = useState(0);
  const [userPage, setUserpage] = useState(1);
  const [totalUserPages, setTotalUsersPages] = useState(0);

  const fetchByTag = async (query) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + `/blogs/search/${query}/${page}`
      );
      if (!response.ok) {
        throw new Error("some Internal Error");
      }
      const data = await response.json();
      //   console.log("data", data);
      setBlogs(data);
      if (data.totalPages === 0) {
        setTotalpages(0);
        return;
      }
      setTotalpages(data.totalPages);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const fetchUsers = async (query) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + `/blogs/user/${query}/${userPage}`
      );
      const data = await response.json();
      console.log(data.message);
      if (data.totalPages === 0) {
        setTotalUsersPages(0);
        return;
      }
      //{data.message}
      setRelatedUsers(data.message);
      setTotalUsersPages(data.totalPages);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  useEffect(() => {
    defaultBtnRef.current.click();
    fetchByTag(query);
  }, [query, page]);
  useEffect(() => {
    fetchUsers(query);
  }, [query]);
  return (
    <section className=" w-full h-cover flex p-3">
      <Toaster />
      <div className="w-full px-3 pl-6 py-1 md:w-[60%] md:mr-[119 px] md:ml-auto">
        <InpageNav
          routes={[`Search results for ${query}`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <div className="pl-3 mt-8 w-full">
            {blogs && blogs.message ? (
              totalPages === 0 ? (
                <Nodata message={`No blogs related to  ${query}`} />
              ) : (
                <>
                  {blogs.message.map((blog, index) => {
                    return (
                      <AnimationWrapper
                        initial={{ scale: 0.25 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                        key={index}
                      >
                        <BlogPost blogDetails={blog}></BlogPost>
                      </AnimationWrapper>
                    );
                  })}
                  {totalPages > 1 && (
                    <PageNav setPage={setPage} totalPages={totalPages} />
                  )}
                </>
              )
            ) : (
              <Loader />
            )}
          </div>
          <div>
            {totalUserPages > 0 ? (
              <UserCard users={relatedUsers} />
            ) : (
              <Nodata message={`No Accounts related to  ${query}`} />
            )}
          </div>
        </InpageNav>
      </div>
      <div className="min-w-[40%] max-w-min lg:min-w-[400px] border-l border-grey max-md:hidden my-4 px-6">
        <h1 className="mb-3 mt-4">Related Users</h1>
        {totalUserPages > 0 ? (
          <UserCard users={relatedUsers} />
        ) : (
          <div className="w-full">
            <Nodata message={`No Accounts related to  ${query}`} />
          </div>
        )}
      </div>
      {/* TODO:Accounts matched */}
    </section>
  );
};

export default Search;
