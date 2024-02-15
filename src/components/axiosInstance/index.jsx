import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "",
});
const reqInterceptor = axiosInstance.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("token");
    request.headers["Authorization"] = "Bearer " + accessToken;
    request.headers["Content-Type"] = "application/json";
    return request;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.path("/auth/signIn");
    }
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("Role");
      window.location.pathname = "/auth/signIn";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
