import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "./api-endpoint";
import http from "../Utils/http";
import { showErrorMessage, showSuccessMessage } from "../Utils/notifications";

const getProducts = async () => {
  const { data } = await http.get(API_ENDPOINTS.PRODUCT);
  console.log("query product:", data);
  return data.data;
};

export const useGetProducts = () => {
  const { data, isLoading, isFetching, error } = useQuery(
    "products",
    getProducts
  );
  return { data, isLoading, error, isFetching };
};

// Create a new product
const createProduct = async (newProduct) => {
  const { data } = await http.post(API_ENDPOINTS.PRODUCT, newProduct);
  return data.data;
};

// Update an existing product
const updateProduct = async ({ productId, updatedFields }) => {
  const { data } = await http.put(
    `${API_ENDPOINTS.PRODUCT}/${productId}`,
    updatedFields
  );
  return data.data;
};

// Delete a product
const deleteProduct = async (productId) => {
  const { data } = await http.delete(`${API_ENDPOINTS.PRODUCT}/${productId}`);
  return data.data;
};

// Add an image to a product
const addProductImage = async ({ productId, imageFile }) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await http.post(
    `${API_ENDPOINTS.PRODUCT}/${productId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.data;
};

// Delete an image from a product
const deleteProductImage = async ({ productId, imageUrl }) => {
  const { data } = await http.put(
    `${API_ENDPOINTS.PRODUCT}/${productId}/images/delete`,
    { url: imageUrl }
  );
  return data.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(createProduct, {
    onSuccess: () => {
      showSuccessMessage("Sản phẩm đã được tạo thành công!");
      queryClient.invalidateQueries("products");
    },
    onError: () => {
      showErrorMessage("Không thể tạo sản phẩm.");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(updateProduct, {
    onSuccess: () => {
      showSuccessMessage("Sản phẩm đã được cập nhật thành công!");
      queryClient.invalidateQueries("products");
    },
    onError: () => {
      showErrorMessage("Không thể cập nhật sản phẩm.");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: () => {
      showSuccessMessage("Sản phẩm đã được xóa thành công!");
      queryClient.invalidateQueries("products");
    },
    onError: () => {
      showErrorMessage("Không thể xóa sản phẩm.");
    },
  });
};

export const useAddProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation(addProductImage, {
    onSuccess: () => {
      showSuccessMessage("Ảnh đã được thêm vào thành công!");
      queryClient.invalidateQueries("products");
    },
    onError: () => {
      showErrorMessage("Không thể thêm ảnh.");
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProductImage, {
    onSuccess: () => {
      showSuccessMessage("Ảnh đã được xóa thành công!");
      queryClient.invalidateQueries("products");
    },
    onError: () => {
      showErrorMessage("Không thể xóa ảnh.");
    },
  });
};

// Inactivate a product
const inactivateProduct = async (productId) => {
  const { data } = await http.post(
    `${API_ENDPOINTS.PRODUCT}/${productId}/inactive`
  );
  return data.data;
};

// Activate a product
const activateProduct = async (productId) => {
  const { data } = await http.post(
    `${API_ENDPOINTS.PRODUCT}/${productId}/active`
  );
  return data.data;
};

export const useInactivateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(inactivateProduct, {
    onSuccess: () => {
      showSuccessMessage("Đã ngưng kích hoạt sản phẩm!");
      queryClient.invalidateQueries("products");
    },
    onError: () => {
      showErrorMessage("Không thể ngưng kích hoạt sản phẩm.");
    },
  });
};

export const useActivateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(activateProduct, {
    onSuccess: () => {
      showSuccessMessage("Kích hoạt sản phẩm thành công!");
      queryClient.invalidateQueries("products");
    },
    onError: () => {
      showErrorMessage("Không thể kích hoạt sản phẩm.");
    },
  });
};
