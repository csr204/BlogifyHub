import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import dateUtensils from "../common/date";
import AnimationWrapper from "../common/AnimationWrapper";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPost from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentWrapper, {
  fetchComments,
} from "../components/comments.component";
const blogStructure = {
  activity: {
    total_likes: "",
    total_reads: "",
    total_comments: "",
    total_parent_comments: "",
  },
  title: "",
  banner: "",
  des: "",
  content: [],
  publishedAt: "",
  author: { personal_info: { fullname: "", username: "", profile_img: "" } },
};
export const blogContext = createContext({
  blog: {},
  setBlog: () => {},
  commentWrapper: true,
  setCommentWrapper: () => {},
  totalParentComments: 0,
  setTotalParentComments: () => {},
});
const BlogPage = () => {
  const { id: blogId } = useParams();
  const [Loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [commentWrapper, setCommentWrapper] = useState(false);
  const [totalParentComments, setTotalParentComments] = useState(0);
  const {
    title,
    blogId: blog_id,
    banner,
    des,
    content,
    publishedAt,
    author: {
      personal_info: { username: author_username, fullname, profile_img },
    },
    _id,
  } = blog;
  const getBlog = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/blogs/read/${blogId}`,
        { method: "POST" }
      );
      const message = await response.json();
      if (!response.ok) {
        throw new Error("error:", message);
      }
      if (message.message.title !== "" && message.message.tags.length > 0) {
        const similarBlogsReq = await fetch(
          `http://localhost:3000/blogs/category/${message.message.tags[0]}/1/${blogId}`
        );
        const resultsForSimilarBlogs = await similarBlogsReq.json();
        setSimilarBlogs(resultsForSimilarBlogs.message);
        // console.log(resultsForSimilarBlogs.message);
      }
      // console.log(message.message._id);
      //blog-message.message
      message.message.comments = await fetchComments({
        blog_id: message.message._id,
        setParentCommentsFun: setTotalParentComments,
      });
      // console.log(message.message);
      setBlog(message.message);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    getBlog();
  }, [blogId]);
  return (
    <AnimationWrapper>
      {Loading && <Loader />}
      <blogContext.Provider
        value={{
          blog,
          setBlog,
          commentWrapper,
          setCommentWrapper,
          totalParentComments,
          setTotalParentComments,
        }}
      >
        {/* comment wrapper */}
        <CommentWrapper />
        <div className="max-w-[900px] px-10 center py-6 h-cover">
          <img src={banner} className="aspect-video"></img>
          <div className="mt-10">
            <h4 className="font-bold text-[24px] capitalize">{title}</h4>
            <div className="md:flex md:items-center md:justify-between max-md:flex-col">
              <div className="flex mt-4  gap-4">
                <img src={profile_img} className="w-10 h-10 rounded-full"></img>
                <div>
                  <p className="capitalize">{fullname}</p>
                  <Link
                    className="underline cursor-pointer"
                    to={`/user/${author_username}`}
                  >
                    @{author_username}
                  </Link>
                </div>
              </div>
              <p className="text-dark-grey max-md:mt-2 max-md:ml-[47px]">
                published on{" "}
                <span className="text-black">
                  {dateUtensils.getDate(publishedAt)}
                </span>
              </p>
            </div>
            <BlogInteraction />
            {blog.content.length > 0 && (
              <div className="mt-10">
                {blog.content[0].blocks.map((block, index) => {
                  return (
                    <div key={index} className="my-3">
                      <BlogContent block={block} />
                    </div>
                  );
                })}
              </div>
            )}
            {similarBlogs !== null && similarBlogs.length >= 1 ? (
              <div className="mt-[150px]">
                <h4 className="text-[22px] font-bold">Similar Blogs</h4>
                {similarBlogs.map((blog, index) => {
                  return (
                    <AnimationWrapper key={index}>
                      <BlogPost blogDetails={blog}></BlogPost>
                    </AnimationWrapper>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </blogContext.Provider>
    </AnimationWrapper>
  );
};

export default BlogPage;
