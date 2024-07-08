import http from "../Utils/http";
import { API_ENDPOINTS } from "./api-endpoint";
import { useQuery } from "react-query";

const getCustomers = async () => {
  const { data } = await http.get(API_ENDPOINTS.ALL_CUSTOMERS);
  console.log("query customer:", data);
  return data.data;
};

export const useGetCustomers = () => {
  const { data, isLoading, isFetching, error } = useQuery(
    "customers",
    getCustomers
  );
  return { data, isLoading, error, isFetching };
};
