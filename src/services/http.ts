import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
const isTokenValid = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (err) {
    return false;
  }
};

const api = axios.create({ baseURL: import.meta.env.VITE_APP_API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("leaveRequestToken");

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("leaveRequestToken");

    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (token && !isTokenValid(token)) {
      localStorage.removeItem("leaveRequestToken");
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/login";
      });
    }
    return config;
  });

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      Swal.fire({
        icon: "error",
        title: "Server Unreachable",
        text: "The server is currently offline or not responding. Please try again later.",
        confirmButtonText: "OK",
      });
    }
    if (err.response.status === 500) {
      Swal.fire({
        icon: "error",
        title: "USER ROLE NOT FOUND",
        text: "The specific role isn't found in the database. Please try again later.",
        confirmButtonText: "OK",
      });
    }

    return Promise.reject(err);
  }
);

export default api;
