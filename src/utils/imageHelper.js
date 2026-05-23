export const getImageUrl = (imagePath, imageUrl) => {
  if (imagePath) {
    return `${import.meta.env.VITE_API_URL || 'https://qwh.com.sa/backend/public'}/storage/${imagePath}`;
  }
  if (imageUrl) {
    return imageUrl;
  }
  return null;
};
