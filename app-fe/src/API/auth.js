import { showSuccessMessage } from "../Utils/notifications";
import http, { setToken } from "../Utils/http";
import { API_ENDPOINTS } from "./api-endpoint";
import { useMutation } from "react-query";
import { useRoleStore } from "../Zustand/Role";

// Sign In function
const signIn = async (data) => {
  const response = await http.post(API_ENDPOINTS.SIGN_IN, data);
  return response.data;
};

export const useSignIn = () => {
  const { setIsSignedIn } = useRoleStore();
  return useMutation(signIn, {
    onSuccess: (data) => {
      setIsSignedIn(true);
      setToken(data.data.access_token);
      console.log("data", data.data.access_token);
      showSuccessMessage("Sign In successfully!");
    },
    onError: () => {
      showErrorMessage("Failed to Sign In.");
    },
  });
};
