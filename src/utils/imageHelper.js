export const getImageUrl = (imagePath, imageUrl) => {
  if (imageUrl) return imageUrl;
  if (imagePath) return `https://qwh.com.sa/storage/${imagePath}`;
  return null;
};
