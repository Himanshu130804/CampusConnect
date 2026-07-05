const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_BASE = API_BASE.replace("/api", "");

export const getFileUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${SERVER_BASE}${url}`;
};
