import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useGetProductById } from "../../../API/productApi";

const ProductDetail = ({ productId, quantity, index }) => {
  const { data: product, isLoading, error } = useGetProductById(productId);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Có lỗi xảy ra khi tải thông tin sản phẩm.</Text>;

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "0 VND";
    const numValue = Number(value); // Convert value to a number
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue.toFixed(2));
  };

  const formattedPrice = formatCurrency(product?.basePrice);

  return (
    <View className="flex-row w-full ">
      <Text className="mr-2 font-semibold">{index + 1}.</Text>
      <Image
        source={{
          uri: product?.image_url
            ? product?.image_url
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJRS-4chjWMRAmrtz7ivK53K_uygrgjzw9Uw&s",
        }}
        style={styles.productImage}
      />
      <View className="w-[75%]">
        <Text className="font-semibold">
          [{product?.productCode}] - {product?.name}
        </Text>
        <Text className="text-xs">{product?.weight} gram</Text>
        <View className="flex-row justify-between">
          <Text className="text-xs">Số lượng: {quantity}</Text>
          <Text className=" text-sm font-semibold">{formattedPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ccac0073",
  },
  customerDetailCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    // backgroundColor: "#ffffff",
  },
  detailTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#937C00",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  orderListContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  orderRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  orderText: {
    fontSize: 16,
    marginBottom: 4,
  },
  orderDetailText: {
    fontSize: 14,
    marginLeft: 16,
    color: "#555",
  },
  image: {
    width: 20,
    height: 20,
    marginBottom: 10,
    marginRight: 3,
  },
  productImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    marginRight: 5,
  },

  statusIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statusWait: {
    color: "#FFC600", // Màu vàng đậm cho trạng thái chờ thanh toán
  },
  statusPaid: {
    color: "#008000", // Màu xanh lá đậm cho trạng thái đã thanh toán
  },
  statusReturn: {
    color: "#FF0000", // Màu đỏ đậm cho trạng thái trả hàng
  },

  loadMoreButton: {
    backgroundColor: "#ccac00",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default ProductDetail;
