const uploadImage = async (img) => {
  let imgurl = null;
  try {
    const res = await fetch(import.meta.env.VITE_SERVER + "/getawsurl");
    let uploadUrl = await res.json();
    uploadUrl = uploadUrl.message;
    const upload = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: img,
    });
    imgurl = uploadUrl.split("?")[0];
    console.log(imgurl);
    return imgurl;
  } catch (err) {
    console.log(err);
  }
};
export default uploadImage;
