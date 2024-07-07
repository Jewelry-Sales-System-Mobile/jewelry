import { useQuery } from "react-query";
import { API_ENDPOINTS } from "./api-endpoint";
import http from "../Utils/http";

const getCounters = async () => {
    const { data } = await http.get(API_ENDPOINTS.COUNTER);
    console.log("query counter:", data);
    return data.data;
  };
  export const useGetCounters = () => {
    const { data, isLoading, isFetching, error } = useQuery(
      "counters",
      getCounters
    );
    return { data, isLoading, error, isFetching };
  };

  const getCounterById = async ({counterId}) => {
    const { data } = await http.get(`${API_ENDPOINTS.COUNTER}/${counterId}`);
    console.log("query counter detail:", data);
    return data.data;
  };
  export const useGetCounterById = (counterId) => {
    const { data, isLoading, isFetching, error } = useQuery(
      ["counter", counterId],
      () => getCounterById(counterId),
      {
        enabled: !!counterId, 
      }
    );
    return { data, isLoading, error, isFetching };
  };