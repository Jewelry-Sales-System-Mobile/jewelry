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

const getCounterById = async ({ counterId }) => {
  // console.log("Fetching counter details for ID:", counterId);
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

//========== create ==========
const createCounter = async ({ name }) => {
  const { data } = await http.post(API_ENDPOINTS.COUNTER, {
    name,
  });
  return data.data;
};

export const useCreateCounter = () => {
  const queryClient = useQueryClient();
  return useMutation(createCounter, {
    onSuccess: () => {
      showSuccessMessage("Tạo quầy hàng mới thành công!");
      queryClient.invalidateQueries("counters");
    },
    onError: () => {
      showErrorMessage("Failed to create counter.");
    },
  });
};

// === update

const updateCounter = async ({ counterId, counterName }) => {
  const { data } = await http.put(`${API_ENDPOINTS.COUNTER}/${counterId}`, {
    counter_name: counterName
  });
  return data.data;
};

export const useUpdateCounter = () => {
  const queryClient = useQueryClient();
  return useMutation(updateCounter, {
    onSuccess: () => {
      showSuccessMessage("Cập nhật thông tin quầy hàng thành công!");
      queryClient.invalidateQueries("counters");
      queryClient.invalidateQueries("counter");
    },
    onError: () => {
      showErrorMessage("Failed to update counter.");
    },
  });
};

//==== delete ===

  const deleteCounter = async (counterId) => {
    const { data } = await http.delete(`${API_ENDPOINTS.COUNTER}/${counterId}`);
    return data.data;
  };
  export const useDeleteCounter = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteCounter, {
      onSuccess: () => {
        showSuccessMessage("Xoá quầy hàng thành công!");
        queryClient.invalidateQueries("counters");
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
        showSuccessMessage("Đã thêm nhân viên vào quầy!");
        queryClient.invalidateQueries("counters");
        queryClient.invalidateQueries("counter");
        queryClient.invalidateQueries("freeStaffs");
      },
      onError: () => {
        showErrorMessage("Failed to assign employee.");
      },
    });
  };

  //========== unassign ==========
const unassignEmployee = async ({ counterId, employeeId }) => {
  const { data } = await http.delete(`${API_ENDPOINTS.COUNTER}/${counterId}/unassign`, {
    data: { employee_id: employeeId }
  });
  return data.data;
};

export const useUnassignEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation(unassignEmployee, {
    onSuccess: () => {
      showSuccessMessage("Xoá nhân viên khỏi quầy thành công!");
      queryClient.invalidateQueries("counters");
      queryClient.invalidateQueries("counter");
      queryClient.invalidateQueries("staff");
      queryClient.invalidateQueries("freeStaffs");
    },
    onError: () => {
      showErrorMessage("Failed to unassign employee.");
    },
  });
};

