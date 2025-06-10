import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_APP_API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("leaveRequestToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("leaveRequestToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
