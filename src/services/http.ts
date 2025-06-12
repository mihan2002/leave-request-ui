import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
    if(token && !isTokenValid(token)){
      localStorage.removeItem("leaveRequestToken");
      window.location.href = "/login";
    }
    return config;
  });

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
  
    return Promise.reject(err);
  }
);

export default api;
