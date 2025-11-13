import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = `/`;
    }
    return Promise.reject(error);
  }
);

export default api;
