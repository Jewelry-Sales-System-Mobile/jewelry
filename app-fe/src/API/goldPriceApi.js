import { useQuery, useMutation, useQueryClient } from "react-query";
import http from "../Utils/http";
import { showErrorMessage, showSuccessMessage } from "../Utils/notifications";
import { API_ENDPOINTS } from "./api-endpoint";

const getGoldPrices = async () => {
  const { data } = await http.get(API_ENDPOINTS.GOLD_PRICES);
  return data.data;
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
