import { useQuery, useMutation, useQueryClient } from "react-query";
import http from "../Utils/http";
import { showErrorMessage, showSuccessMessage } from "../Utils/notifications";
import { API_ENDPOINTS } from "./api-endpoint";

const getGoldPrices = async () => {
  try {
    const response = await http.get(API_ENDPOINTS.GOLD_PRICES);
    return response.data.data; // Đảm bảo trả về dữ liệu như mong đợi từ API
  } catch (error) {
    throw new Error("Failed to fetch gold prices");
  }
};

const updateGoldPrices = async (prices) => {
  const { data } = await http.patch(API_ENDPOINTS.GOLD_PRICES, prices);
  return data.data;
};

export const useGetGoldPrices = () => {
  const { data, isLoading, error, isFetching } = useQuery(
    "goldPrices",
    getGoldPrices
  );

  // Xử lý trường hợp lỗi từ API
  if (error) {
    showErrorMessage("Failed to fetch gold prices"); // Hiển thị thông báo lỗi
    console.error("Error fetching gold prices:", error); // Log lỗi ra console
  }

  return { data, isLoading, error, isFetching };
};

export const useUpdateGoldPrices = () => {
  const queryClient = useQueryClient();
  return useMutation(updateGoldPrices, {
    onSuccess: () => {
      showSuccessMessage("Giá vàng đã được cập nhật thành công!");
      queryClient.invalidateQueries("goldPrices");
    },
    onError: () => {
      showErrorMessage("Không thể cập nhật giá vàng.");
    },
  });
};
