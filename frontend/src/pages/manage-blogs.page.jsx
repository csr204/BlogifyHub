import React, { useContext, useEffect, useState } from "react";
import userContext from "../common/Context";
import InpageNav from "../components/inpage-navigation.component";
import ManageBlogComponent, {
  ManageDraft,
} from "../components/manage-blogcard.component";
import Loader from "../components/loader.component";
import Nodata from "../components/nodata.component";
import { Toaster } from "react-hot-toast";

const ManageBlogs = () => {
  const [blogsState, setBlogs] = useState(null);
  const [draftsState, setDrafts] = useState(null);
  const [query, setQuery] = useState("");
  const { isLoggedIn } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    message: { token },
  } = isLoggedIn;
  let blogs = null,
    drafts = null;
  let deletedBlogs = 0,
    deletedDrafts = 0;
  if (blogsState) {
    blogs = blogsState.blogs;
    deletedBlogs = blogsState.deletedDocs;
  }
  if (draftsState) {
    drafts = draftsState.blogs;
    deletedDrafts = draftsState.deletedDocs;
  }
  const fetchBlogs = async ({ page = 1, draft, deletedDocs = 0 }) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + "/users/get-all-blogs",
        {
          method: "POST",
          body: JSON.stringify({ draft, query, deletedDocs, page }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message: data } = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data);
      setIsLoading(false);
      if (draft) {
        setDrafts(data);
      } else setBlogs(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    if (token) {
      if (blogsState === null) {
        fetchBlogs({ page: 1, draft: false, deletedDocs: deletedBlogs });
      }
      if (draftsState === null) {
        fetchBlogs({ page: 1, draft: true, deletedDocs: deletedDrafts });
      }
    }
  }, [query, blogsState, draftsState]);
  const queryHandler = (e) => {
    setQuery(e.target.value);
    if (e.keyCode === 13 && e.target.value.length) {
      setBlogs(null);
      setDrafts(null);
    }
  };
  // const changeHandler = () => {
  //   setBlogs(null);
  //   setQuery("");
  //   setDrafts(null);
  // };
  {
    console.log(blogs);
  }
  return (
    <div>
      <Toaster />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h1 className="max-md:hidden px-3 w-full">User Blogs</h1>
          <div className="px-2 py-2">
            <div className="w-full relative">
              <input
                className="input-box max-w-[400px] rounded-full  max-md:mt-4 h-[40px] my-3"
                placeholder="search blogs.."
                // onChange={changeHandler}
                onKeyDown={queryHandler}
              ></input>
              <i className="ri-search-line absolute top-4 left-5 text-[16px] max-md:top-6"></i>
            </div>
            <InpageNav
              routes={["Published blogs", "drafts"]}
              defaultHidden={["drafts"]}
            >
              <div className="pl-3 mt-8 w-full">
                {blogs && blogs.length !== 0 ? (
                  blogs.map((blog, ind) => {
                    return (
                      <ManageBlogComponent
                        blog={blog}
                        key={ind}
                        index={ind}
                        setStateFunction={{ blogsState, setBlogs }}
                      />
                    );
                  })
                ) : (
                  <Nodata message={`No published blogs found `} />
                )}
              </div>
              <div className="pl-3 mt-8 w-full">
                {drafts && drafts.length !== 0 ? (
                  drafts.map((draft, ind) => {
                    return (
                      <ManageDraft
                        blog={draft}
                        key={ind}
                        index={ind}
                        setStateFunction={{ draftsState, setDrafts }}
                      />
                    );
                  })
                ) : (
                  <Nodata message={`No drafts found `} />
                )}
              </div>
            </InpageNav>
            <p className="mt-5 text-2xl font-inter font-bold max-md:hidden">
              Drafts
            </p>
            <div className="max-md:hidden">
              {drafts && drafts.length !== 0 ? (
                drafts.map((draft, ind) => {
                  return (
                    <ManageDraft
                      blog={draft}
                      key={ind}
                      index={ind}
                      setStateFunction={{ draftsState, setDrafts }}
                    />
                  );
                })
              ) : (
                <Nodata message={`No drafts found `} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBlogs;
