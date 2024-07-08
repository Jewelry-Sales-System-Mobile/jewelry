import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../Utils/http";
import { showErrorMessage, showSuccessMessage } from "../Utils/notifications";
import { API_ENDPOINTS } from "./api-endpoint";

// Create a new staff account
const registerStaff = async (newStaff) => {
  const { data } = await http.post(`${API_ENDPOINTS.USERS}/register`, newStaff);
  return data.data;
};

// Get all staff accounts
const getAllStaff = async () => {
  const { data } = await http.get(`${API_ENDPOINTS.USERS}/get-all`);
  return data.data;
};

// Get a staff account by ID
const getStaffById = async (staffId) => {
  const { data } = await http.get(`${API_ENDPOINTS.USERS}/${staffId}`);
  return data.data;
};

// Get my profile
const getMyProfile = async () => {
  const { data } = await http.get(`${API_ENDPOINTS.USERS}/profile/my-profile`);
  return data.data;
};

// Change password
const changePassword = async (passwords) => {
  const { data } = await http.put(
    `${API_ENDPOINTS.USERS}/change-password`,
    passwords
  );
  return data.data;
};

// Update an existing staff account
const updateStaff = async ({ staffId, updatedFields }) => {
  const { data } = await http.put(
    `${API_ENDPOINTS.USERS}/update/${staffId}`,
    updatedFields
  );

  return data.data;
};

// Activate a staff account
const activateStaff = async (staffId) => {
  const { data } = await http.put(`${API_ENDPOINTS.USERS}/${staffId}/active`);
  return data.data;
};

// Inactivate a staff account
const inactivateStaff = async (staffId) => {
  const { data } = await http.put(`${API_ENDPOINTS.USERS}/${staffId}/inactive`);
  return data.data;
};

// Custom hooks for using these APIs
export const useRegisterStaff = () => {
  const queryClient = useQueryClient();

  return useMutation(registerStaff, {
    onSuccess: () => {
      showSuccessMessage("Tạo tài khoản thành công");
      queryClient.invalidateQueries("staffs");
    },
    onError: () => {
      showErrorMessage("Có lỗi xảy ra khi tạo tài khoản");
    },
  });
};

export const useGetAllStaff = () => {
  const { data, isLoading, isFetching, error } = useQuery(
    "staffs",
    getAllStaff
  );
  return { data, isLoading, error, isFetching };
};

export const useGetStaffById = (staffId) => {
  const { data, isLoading, error, refetch } = useQuery(["staff", staffId], () =>
    getStaffById(staffId)
  );

  return { data, isLoading, error, refetch };
};

export const useGetMyProfile = () => {
  return useQuery("myProfile", getMyProfile);
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation(changePassword, {
    onSuccess: () => {
      showSuccessMessage("Thay đổi mật khẩu thành công");
      queryClient.invalidateQueries("staffs");
    },
    onError: () => {
      showErrorMessage("Có lỗi xảy ra khi thay đổi mật khẩu");
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation(updateStaff, {
    onSuccess: () => {
      showSuccessMessage("Cập nhật thông tin thành công");
      queryClient.invalidateQueries("staffs");
    },
    onError: () => {
      showErrorMessage("Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
};

export const useActivateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation(activateStaff, {
    onSuccess: () => {
      showSuccessMessage("Kích hoạt tài khoản thành công");
      queryClient.invalidateQueries("staffs");
    },
    onError: () => {
      showErrorMessage("Có lỗi xảy ra khi kích hoạt tài khoản");
    },
  });
};

export const useInactivateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation(inactivateStaff, {
    onSuccess: () => {
      showSuccessMessage("Vô hiệu hóa tài khoản thành công");
      queryClient.invalidateQueries("staffs");
    },
    onError: () => {
      showErrorMessage("Có lỗi xảy ra khi vô hiệu hóa tài khoản");
    },
  });
};
