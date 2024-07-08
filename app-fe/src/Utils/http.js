import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const http = axios.create({
  // baseURL: "http://192.168.1.12:4000",
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
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers[
          "Authorization"
        ] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY4MTZjYjU0YWI1MGVkOGRmY2FhMmY0IiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoxLCJyb2xlIjowLCJpYXQiOjE3MjAzNzIxMDAsImV4cCI6MTcyMDQ1ODUwMH0.FLOT-d-db8LD-j7LtD9MyRMDJU8zF7cFXZUlwN83ljE`;
      }
    } catch (error) {
      console.log("Error getting auth token", error);
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
    await AsyncStorage.removeItem("auto_token");
    console.log("auto_token removed successfully");
  } catch (error) {
    console.error("Failed to remove auto_token", error);
  }
};

export default http;
