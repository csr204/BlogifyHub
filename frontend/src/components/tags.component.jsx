import React, { useContext } from "react";
import { blogContext } from "../pages/editor.pages";

const Tag = ({ tag, tagIndex }) => {
  const { setBlogState, blogState } = useContext(blogContext);
  const removeHandler = () => {
    let exisitingTags = [...blogState.tags];
    const updatedTags = exisitingTags.filter((t) => {
      return tag !== t;
    });
    setBlogState((prev) => {
      return { ...prev, tags: updatedTags };
    });
  };
  const editableToggler = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };
  const tagEditHandler = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let exisitingTags = [...blogState.tags];
      exisitingTags[tagIndex] = e.target.innerText;
      setBlogState((prev) => {
        return { ...prev, tags: exisitingTags };
      });
      e.target.setAttribute("contentEditable", false);
    }
  };
  return (
    <div
      className={`inline-block bg-white mt-2 pl darkMode ? "text-black" : ""
      }`}
    >
      <i
        class="ri-close-fill absolute z-20  text-2xl cursor-pointer right-2 top-[8%]"
        onClick={removeHandler}
      ></i>
      <p
        className="outline-none text-xl capitalize"
        onClick={editableToggler}
        onKeyDown={tagEditHandler}
      >
        {tag}
      </p>
    </div>
  );
};

export default Tag;
