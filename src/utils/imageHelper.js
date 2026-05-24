export const getImageUrl = (path) => {
  if (!path) return null;
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use your API base URL (without trailing /api if present)
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || '';
  return `${baseUrl}/storage/${cleanPath}`;
};
