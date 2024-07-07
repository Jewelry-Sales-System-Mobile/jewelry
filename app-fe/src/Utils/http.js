import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const http = axios.create({
  baseURL: "http://localhost:4000/",
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
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers[
        "Authorization"
      ] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY4M2YxZGI4NmIzNDRjNWMwZWUwMTk4IiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoxLCJyb2xlIjoxLCJpYXQiOjE3MjAyNTI4MjksImV4cCI6MTcyMDMzOTIyOX0.Y3agAgFSPrT4xH2GoMEA-mB-DspsGybWtC06rEls-1M`;
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
