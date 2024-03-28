let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const formatDate = (timeStamp) => {
  let dateObj = new Date(timeStamp);
  const month = dateObj.getMonth();
  const date = dateObj.getDate();
  return `${date} ${months[month]}`;
};
const getDate = (timeStamp) => {
  const originalDate = new Date(timeStamp);
  const options = { day: "2-digit", month: "short" };
  const formatedDate = originalDate.toLocaleString("en-US", options);
  return formatedDate;
};
export default { formatDate, getDate };
