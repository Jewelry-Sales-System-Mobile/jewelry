import { showSuccessMessage } from "../Utils/notifications";
import http, { setToken } from "../Utils/http";
import { API_ENDPOINTS } from "./api-endpoint";
import { useMutation, useQuery } from "react-query";
import { useCartStore } from "../Zustand/CartForStaff";
import { useNavigation } from "@react-navigation/native";

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
  const navigate = useNavigation();
  const { resetCart } = useCartStore();
  return useMutation(makerOrder, {
    onSuccess: (data) => {
      console.log("data", data);
      resetCart();
      navigate.navigate("OrderSuccess", { orderData: data });
      showSuccessMessage("Make Order Successfully!");
    },
    onError: () => {
      showErrorMessage("Failed to Make Order.");
    },
  });
};
