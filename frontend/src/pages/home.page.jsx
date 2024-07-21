import React, { useContext, useEffect, useState } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import InpageNav from "../components/inpage-navigation.component";
import toast from "react-hot-toast";
import BlogPost from "../components/blog-post.component";
import Loader from "../components/loader.component";
import Trending from "../components/Trending";
import { defaultBtnRef } from "../components/inpage-navigation.component";
import Nodata from "../components/nodata.component";
import PageNav from "../components/PageNav";
import { searchRef } from "../components/navbar.component";
import userContext from "../common/Context";
const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [currentCat, setCurrentCat] = useState("Home");
  const [page, setPage] = useState(1);
  const { showSearch, darkMode } = useContext(userContext);
  const [totalPages, setTotalpages] = useState(1);
  const getLatestBlogs = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + `/blogs/latest-blogs/${page}`
      );
      const data = await response.json();
      // console.log(data.message);
      //data.message in an array of objs
      // console.log(data);
      setTotalpages(data.totalPages);
      setBlogs(data);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const getTrendingBlogs = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + "/blogs/trending-blogs"
      );
      const data = await response.json();
      // console.log(data.message);
      //data.message in an array of objs
      setTrendingBlogs(data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const fetchByTag = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + `/blogs/category/${currentCat}/${page}/'`
      );
      const data = await response.json();
      console.log(data);
      setTotalpages(data.totalPages);
      setBlogs(data);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  useEffect(() => {
    defaultBtnRef.current.click();
    if (searchRef.current != null) {
      searchRef.current.value = "";
    }
    if (currentCat === "Home") {
      getLatestBlogs();
    }
    if (currentCat !== "Home") {
      fetchByTag();
    }
    if (trendingBlogs === null) {
      getTrendingBlogs();
    }
  }, [currentCat, page]);
  const categories = [
    "programming",
    "science",
    "movies",
    "sports",
    "politics",
    "maths",
    "food",
    "travel",
    "technology",
    "education",
  ];
  const loadBlogBycategory = (e) => {
    const tag = e.target.innerText.toLowerCase();
    setBlogs(null);
    setPage(1);
    if (tag === currentCat) {
      setCurrentCat("Home");
      return;
    }
    setCurrentCat(tag);
    //make request to fetch blogs which belong to that category(creat an api)
  };
  return (
    <AnimationWrapper>
      <section
        className={`h-cover flex justify-center gap-10 relative  ${
          darkMode ? "bg-[#1a1a1a]  text-white" : ""
        }`}
      >
        <div
          className={`w-full pl-3 max-md:absolute ${
            showSearch ? "" : " max-md:top-[-35px] "
          } max-md:px-4`}
        >
          <InpageNav
            routes={[currentCat, "Trending"]}
            defaultHidden={["Trending"]}
            defaultIndex={0}
          >
            <div className="pl-3 mt-8 w-full">
              {blogs && blogs.message ? (
                blogs.message.length === 0 ? (
                  <Nodata message={`No blogs with tag ${currentCat}`} />
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
            {/* trending */}
            <div>
              {trendingBlogs ? (
                trendingBlogs.length === 0 ? (
                  <Nodata message={"No trending blogs at present"} />
                ) : (
                  trendingBlogs.map((blog, index) => {
                    return (
                      <Trending blogDetails={blog} index={index} key={index} />
                    );
                  })
                )
              ) : (
                <Loader />
              )}
            </div>
          </InpageNav>
        </div>
        <div className="min-w-[40%] max-w-min lg:min-w-[400px] border-l border-grey max-md:hidden my-4 px-6">
          <h1 className="font-bold mb-5">Stories from all Interests</h1>
          <div className="flex mt-3 flex-wrap">
            {categories.map((category, index) => {
              return (
                <div
                  key={index}
                  onClick={loadBlogBycategory}
                  className={
                    "px-6 py-2 bg-grey rounded-full mx-1 my-2 cursor-pointer hover:bg-black hover:text-white " +
                    `${category == currentCat ? "text-white bg-twitter" : ""} ${
                      darkMode && "text-black"
                    }`
                  }
                >
                  <button className="text-[13px]">{category}</button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 ml-7">
            <span className="font-mono text-3xl ">Trending</span>
            <i className="ri-line-chart-line pl-3 text-3xl"></i>
          </div>
          <div className="mt-3 ml-7">
            {trendingBlogs ? (
              trendingBlogs.length === 0 ? (
                <Nodata message={"No trending blogs at present"} />
              ) : (
                trendingBlogs.map((blog, index) => {
                  return (
                    <Trending blogDetails={blog} index={index} key={index} />
                  );
                })
              )
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
