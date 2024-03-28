import Embed from "@editorjs/embed";
import Link from "@editorjs/link";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import uploadImage from "../common/aws";

const uploadImgByUrl = (e) => {
  const link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });
  console.log(link);
  return link
    .then((url) => {
      return { success: 1, file: { url } };
    })
    .catch((err) => console.log(err));
};
const uploadImgByFile = (e) => {
  return uploadImage(e)
    .then((url) => {
      if (url) {
        return { success: 1, file: { url } };
      }
    })
    .catch((err) => console.log(err));
};
export const tools = {
  embed: Embed,
  link: Link,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImgByUrl,
        uploadByFile: uploadImgByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      levels: [1, 2, 3],
      defaultLevel: 2,
      placeholder: "Heading...",
    },
  },
  marker: Marker,
  quote: {
    class: Quote,
    inlineToolBar: true,
  },
  inline: InlineCode,
  list: {
    class: List,
    inlineToolBar: true,
  },
  code: Code,
};
