export const getImageUrl = (path) => {
  if (!path) return null;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}/storage/${cleanPath}`;
};