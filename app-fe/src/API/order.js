import { showSuccessMessage } from "../Utils/notifications";
import http, { setToken } from "../Utils/http";
import { API_ENDPOINTS } from "./api-endpoint";
import { useMutation, useQuery } from "react-query";
import { useRoleStore } from "../Zustand/Role";

// Sign In function
const makerOrder = async (data) => {
  const response = await http.post(API_ENDPOINTS.ORDER, data);
  return response.data;
};

const getAllOrders = async () => {
  const { data } = await http.get(API_ENDPOINTS.ORDER);
  // debugger;
  return data.data;
};

export { getAllOrders };

export const useGetAllOrders = () => {
  const { data, isLoading, error } = useQuery("orders", getAllOrders);
  return { data, isLoading, error };
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
