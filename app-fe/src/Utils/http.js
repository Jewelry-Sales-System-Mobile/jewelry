import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const http = axios.create({
  // baseURL: "http://192.168.56.2:4000",
  // url của Phương
  // baseURL: "http://192.168.152.2:4000",
 //  baseURL: "http://192.168.1.6:4000",
  baseURL: "http://localhost:4000",
  //http://192.168.1.12:4000/
  // baseURL: "https://nghich.id.vn",

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
export const deleteAutoToken = async () => {
  try {
    await AsyncStorage.removeItem("auth_token");
    console.log("auto_token removed successfully");
  } catch (error) {
    console.error("Failed to remove auto_token", error);
  }
};

export default http;
