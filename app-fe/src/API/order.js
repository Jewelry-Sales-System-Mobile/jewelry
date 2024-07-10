import { showSuccessMessage } from "../Utils/notifications";
import http, { setToken } from "../Utils/http";
import { API_ENDPOINTS } from "./api-endpoint";
import { useMutation } from "react-query";
import { useRoleStore } from "../Zustand/Role";

// Sign In function
const makerOrder = async (data) => {
  const response = await http.post(API_ENDPOINTS.ORDER, data);
  return response.data;
};

export const useMakerOrder = () => {
  return useMutation(makerOrder, {
    onSuccess: (data) => {
      showSuccessMessage("Make Order Successfully!");
    },
    onError: () => {
      showErrorMessage("Failed to Make Order.");
    },
  });
};
