import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export default (baseURL) => {
  const instance = axios.create({
    baseURL,
    ...commonConfig,
  });

  instance.interceptors.request.use((config) => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (e) {}

    // ✅ chỉ add token khi KHÔNG phải public API
    if (user?.token && !config.skipAuth) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }

    return config;
  });

  return instance;
};
