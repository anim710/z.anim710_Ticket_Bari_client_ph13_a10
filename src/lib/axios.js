import axios from "axios";

// All server routes are mounted under /api, so include it in the base URL.
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;