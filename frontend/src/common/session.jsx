const addsessionStorage = (key, value) => {
  sessionStorage.setItem(key, value);
};
const getSessionStorage = (key) => {
  return sessionStorage.getItem(key);
};
const removeSessionStorage = (key) => {
  sessionStorage.removeItem(key);
};
const clearSessionStorage = () => {
  sessionStorage.clear();
};
export {
  addsessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage,
};
