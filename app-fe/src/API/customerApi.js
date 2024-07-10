import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../Utils/http";
import { showErrorMessage, showSuccessMessage } from "../Utils/notifications";
import { API_ENDPOINTS } from "./api-endpoint";

// Get all customers
const getCustomers = async () => {
  const { data } = await http.get(API_ENDPOINTS.CUSTOMERS);
  return data.data;
};

// Get a customer by ID
const getCustomerById = async (customerId) => {
  const { data } = await http.get(`${API_ENDPOINTS.CUSTOMERS}/${customerId}`);
  return data.data;
};

// Create a new customer
const createCustomer = async (newCustomer) => {
  const { data } = await http.post(API_ENDPOINTS.CUSTOMERS, newCustomer);
  return data.data;
};

// Update an existing customer
const updateCustomer = async ({ customerId, updatedFields }) => {
  const { data } = await http.put(
    `${API_ENDPOINTS.CUSTOMERS}/${customerId}`,
    updatedFields
  );
  return data.data;
};

// API to get orders by customer ID
const getOrdersByCustomerId = async (customerId) => {
  const { data } = await http.get(
    `${API_ENDPOINTS.ORDER}/by-customer/${customerId}`
  );
  return data.data;
};

export {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  getOrdersByCustomerId,
};

export const useGetOrdersByCustomerId = (customerId) => {
  const { data, isLoading, error } = useQuery(["orders", customerId], () =>
    getOrdersByCustomerId(customerId)
  );
  return { data, isLoading, error };
};

export const useGetCustomers = () => {
  const { data, isLoading, isFetching, error } = useQuery(
    "customers",
    getCustomers
  );
  return { data, isLoading, error, isFetching };
};

export const useGetCustomerById = (customerId) => {
  const { data, isLoading, isFetching, error } = useQuery(
    ["customer", customerId],
    () => getCustomerById(customerId)
  );
  return { data, isLoading, error, isFetching };
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(createCustomer, {
    onSuccess: () => {
      showSuccessMessage("Khách hàng đã được tạo thành công!");
      queryClient.invalidateQueries("customers");
    },
    onError: () => {
      showErrorMessage("Không thể tạo khách hàng.");
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(updateCustomer, {
    onSuccess: () => {
      showSuccessMessage("Khách hàng đã được cập nhật thành công!");
      queryClient.invalidateQueries("customers");
    },
    onError: () => {
      showErrorMessage("Không thể cập nhật khách hàng.");
    },
  });
};
