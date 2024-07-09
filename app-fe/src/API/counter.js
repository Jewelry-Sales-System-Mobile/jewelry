import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "./api-endpoint";
import http from "../Utils/http";
import { showErrorMessage, showSuccessMessage } from "../Utils/notifications";

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
    console.log("Fetching counter details for ID:", counterId);
    const { data } = await http.get(`${API_ENDPOINTS.COUNTER}/${counterId}`);
    console.log("query counter detail:", data);
    return data.data;
  };
  export const useGetCounterById = (counterId) => {
    const { data, isLoading, isFetching, error } = useQuery(
      ["counter", counterId],
      () => getCounterById({ counterId }),
      {
        enabled: !!counterId, 
      }
    );
    return { data, isLoading, error, isFetching };
  };

  const deleteCounter = async (counterId) => {
    const { data } = await http.delete(`${API_ENDPOINTS.COUNTER}/${counterId}`);
    return data.data;
  };
  export const useDeleteCounter = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteCounter, {
      onSuccess: () => {
        showSuccessMessage("Counter deleted successfully!");
        queryClient.invalidateQueries("Counters");
      },
      onError: () => {
        showErrorMessage("Failed to delete Counter.");
      },
    });
  };
  
  //========== assign ==========
  const assignEmployee = async ({ counterId, employeeId }) => {
    const { data } = await http.post(`${API_ENDPOINTS.COUNTER}/${counterId}/assign`, {
      employee_id: employeeId
    });
    return data.data;
  };
  
  export const useAssignEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation(assignEmployee, {
      onSuccess: () => {
        showSuccessMessage("Employee assigned successfully!");
        queryClient.invalidateQueries("counters");
      },
      onError: () => {
        showErrorMessage("Failed to assign employee.");
      },
    });
  };