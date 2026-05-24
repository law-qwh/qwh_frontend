export const getImageUrl = (path) => {
  if (!path) return null;
  // Just use your API base URL directly
  return `https://qwh.com.sa/backend/public/storage/${path}`;
};
