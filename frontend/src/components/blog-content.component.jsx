import React from "react";
const Img = ({ url, caption }) => {
  return (
    <div>
      <img src={url}></img>
      {caption.length ? (
        <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
          {caption}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};
const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
      <p className="leading-10 text-xl md:text-2xl">{quote}</p>
      {caption.length > 0 && (
        <p className="text-purple text-base w-full">{caption}</p>
      )}
    </div>
  );
};
const BlogContent = ({ block }) => {
  const { type, data } = block;
  if (type === "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }
  if (type === "header") {
    if (data.level == 1) {
      return (
        <h1
          dangerouslySetInnerHTML={{ __html: data.text }}
          className="capitalize"
        ></h1>
      );
    }
    if (data.level == 2) {
      return (
        <h2
          dangerouslySetInnerHTML={{ __html: data.text }}
          className="capitalize"
        ></h2>
      );
    }
    if (data.level == 3) {
      return (
        <h3
          dangerouslySetInnerHTML={{ __html: data.text }}
          className="capitalize"
        ></h3>
      );
    }
  }
  if (type === "image") {
    return <Img url={data.file.url} caption={data.caption}></Img>;
  }
  if (type === "list") {
    if (data.style == "unordered") {
      return (
        <ul className={`pl-5 list-disc`}>
          {data.items.map((item, index) => {
            return (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <ol className={`pl-5 list-decimal`}>
          {data.items.map((item, index) => {
            return (
              <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
            );
          })}
        </ol>
      );
    }
  }
  if (type === "quote") {
    return <Quote quote={data.text} caption={data.caption}></Quote>;
  }
  if (type === "code") {
    return <p className="bg-grey px-2 py-2">{data.code}</p>;
  }
};

export default BlogContent;
