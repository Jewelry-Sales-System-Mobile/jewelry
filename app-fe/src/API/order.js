import { showSuccessMessage } from "../Utils/notifications";
import http, { setToken } from "../Utils/http";
import { API_ENDPOINTS } from "./api-endpoint";
import { useMutation, useQuery, useQueryClient } from "react-query";
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

// API functions for order
const confirmOrder = async (orderId) => {
  const { data } = await http.put(`${API_ENDPOINTS.ORDER}/${orderId}/confirm`);
  return data.data;
};

const cancelOrder = async (orderId) => {
  const { data } = await http.put(`${API_ENDPOINTS.ORDER}/${orderId}/cancel`);
  return data.data;
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(confirmOrder, {
    onSuccess: () => {
      showSuccessMessage("Đơn hàng đã được xác nhận!");
      queryClient.invalidateQueries("orders");
    },
    onError: () => {
      showErrorMessage("Không thể xác nhận đơn hàng.");
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(cancelOrder, {
    onSuccess: () => {
      showSuccessMessage("Đơn hàng đã được hủy!");
      queryClient.invalidateQueries("orders");
    },
    onError: () => {
      showErrorMessage("Không thể hủy đơn hàng.");
    },
  });
};

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
