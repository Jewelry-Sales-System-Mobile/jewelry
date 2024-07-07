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
    // const token = await AsyncStorage.getItem("auth_token");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY4M2YxZGI4NmIzNDRjNWMwZWUwMTk4IiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoxLCJyb2xlIjoxLCJpYXQiOjE3MjAzNjY2MDIsImV4cCI6MTcyMDQ1MzAwMn0.VuGAMh6CB_q9xl7dypCHv0AXGSp_wRTzUWpBxV9NM18";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    console.log("Error getting the auth token", error);
    return null;
  }
};
// Export the http instance to use in your application
export default http;
