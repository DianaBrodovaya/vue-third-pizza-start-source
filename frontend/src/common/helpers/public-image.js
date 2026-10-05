export const getPublicImage = (path) => {
  if (!path) return "";

  if (path.includes("/public/img")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/api${cleanPath}`;
  }

  const publicUrl = "/api/public/img";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  return `${publicUrl}/${cleanPath}`;
};
