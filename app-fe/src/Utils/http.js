import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const http = axios.create({
  baseURL: "http://192.168.1.12:4000",
  //http://192.168.1.12:4000/
  // baseURL: "https://nghich.id.vn",

  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token header to requests
http.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers["Authorization"] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY4MTZjYjU0YWI1MGVkOGRmY2FhMmY0IiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoxLCJyb2xlIjowLCJpYXQiOjE3MjAzNzIxMDAsImV4cCI6MTcyMDQ1ODUwMH0.FLOT-d-db8LD-j7LtD9MyRMDJU8zF7cFXZUlwN83ljE`;
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

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("auth_token", token);
  } catch (error) {
    console.log("Error setting the auth token", error);
  }
};

// Export the http instance to use in your application
export default http;
