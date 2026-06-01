export const getImageUrl = (path) => {
  if (!path) return null;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use the storage path directly (without backend/public)
  return `https://qwh.com.sa/storage/${cleanPath}`;
};