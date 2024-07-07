import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const http = axios.create({
  baseURL: "http://localhost:4000/",
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized error globally
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // navigator.navigate("SignIn");
    }
    return Promise.reject(error);
  }
);

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("auth_token", token);
  } catch (error) {
    console.log("Error setting the auth token", error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    console.log("Error getting the auth token", error);
    return null;
  }
};

export default http;
