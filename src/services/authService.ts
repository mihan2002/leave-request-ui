import api from "./http";
import { jwtDecode } from "jwt-decode";

const getTokenRole = (token: string): void => {
  try {
    const decoded: { role: string } = jwtDecode(token);

    localStorage.setItem("role", decoded.role);
  } catch (err) {
    console.log("🚀 ~ isTokenValid ~ err:", err);
  }
};

export const login = async (username: string, password: string) => {
  const res = await api.post("api/auth/login", { username, password });
  const token = res.data.token;
  localStorage.setItem("leaveRequestToken", token);
  getTokenRole(token);
  return res.data;
};

export const signup = async (username: string, password: string) => {
  const res = await api.post("api/auth/register", { username, password });
  return res;
};

export const logout = () => {
  localStorage.removeItem("leaveRequestToken");
};
