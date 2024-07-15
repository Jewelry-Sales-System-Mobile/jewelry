import { useQuery } from "react-query";
import http from "../Utils/http";
import { showErrorMessage } from "../Utils/notifications";
import { API_ENDPOINTS } from "./api-endpoint";

const getAllOrders = async () => {
  try {
    const response = await http.get(API_ENDPOINTS.ORDER);
 //   console.log("API response:", response); // Log the entire response object
    return response.data.data; // Assuming the API response structure has a `data` field containing orders
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};

export const useGetAllOrders = () => {
  const { data, isLoading, error } = useQuery("orders", getAllOrders);

//  console.log("Data:", data); // Log the `data` received from React Query

  // Handling API errors
  if (error) {
    showErrorMessage("Failed to fetch orders"); // Display error message
    console.error("Error fetching orders:", error); // Log error to console
  }

  return { orders: data, isLoading, error };
};
