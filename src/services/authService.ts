
import api from './http';


export const login = async (username: string, password: string) => {
  const res = await api.post('api/auth/login', { username, password });
  localStorage.setItem("leaveRequestToken", res.data.token);
  return res.data;
};

export const signup = async (username: string, password: string) => {
  const res = await api.post('api/auth/register', { username, password });
  localStorage.setItem("leaveRequestToken", res.data.token);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("leaveRequestToken");
};
