// Orderitem?.js
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import moment from "moment";
import ProductDetail from "./Pproductdetail";
import { useGetCustomerById } from "../../../API/customerApi";

const OrderItem = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);
  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
  } = useGetCustomerById(item?.customer_id);
  console.log("customer order", customer);

  const getStatusImage = (status) => {
    switch (status) {
      case 0:
        return "https://static.thenounproject.com/png/3847261-200.png"; // Chờ thanh toán
      case 1:
        return "https://png.pngtree.com/png-vector/20221215/ourmid/pngtree-green-check-mark-png-image_6525691.png"; // Đã thanh toán
      case 2:
        return "https://static.vecteezy.com/system/resources/previews/018/887/852/non_2x/signs-close-icon-png.png"; // Trả hàng
      default:
        return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chờ thanh toán";
      case 1:
        return "Đã thanh toán";
      case 2:
        return "Trả hàng";
      default:
        return "";
    }
  };

  const getStatusTextStyle = (status) => {
    switch (status) {
      case 0:
        return styles.statusWait;
      case 1:
        return styles.statusPaid;
      case 2:
        return styles.statusReturn;
      default:
        return null;
    }
  };

  return (
    <View style={styles.orderRow}>
      <View className="flex-row items-start w-full">
        <Text className=" mr-4 font-semibold"> #{index + 1}</Text>

        <View>
          {customer && (
            <Text className="font-semibold text-sm">
              Khách hàng:
              <Text className="text-[#937C00] ml-3">
                {customer.name} - {customer.email}
              </Text>
            </Text>
          )}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              {/* <Text className="font-semibold text-sm mr-2">#{index + 1}</Text> */}
              <Image
                source={{ uri: getStatusImage(item?.paymentStatus) }}
                style={styles.image}
              />
              <Text
                className=" ml-2 font-semibold text-lg self-start "
                style={[getStatusTextStyle(item?.paymentStatus)]}
              >
                {getStatusText(item?.paymentStatus)}
              </Text>
            </View>
            <Text className="ml-2 font-semibold text-base  self-start">
              #{item?.order_code}
            </Text>
          </View>
          <Text className="text-xs text-gray  ml-8">
            {moment(item?.created_at).format("DD/MM/YYYY, hh:mm A")}
          </Text>
          <Text className="text-base font-semibold text-[#937C00] my-2 ml-8">
            {item?.total
              ? item?.total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              : 0}{" "}
          </Text>

          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            className="flex-row justify-end mb-4"
          >
            <Text
              style={styles.orderText}
              className="font-medium text-sm underline "
            >
              Sản phẩm{" "}
              {expanded ? (
                <View className="w-3 ml-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </View>
              ) : (
                <View className="w-3 ml-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M241 130.5l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9l-22.7 22.7c-9.4 9.4-24.5 9.4-33.9 0L224 227.5 69.3 381.5c-9.4 9.3-24.5 9.3-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.6 0-33.9L207 130.5c9.4-9.4 24.6-9.4 33.9 0z" />
                  </svg>
                </View>
              )}
            </Text>
          </TouchableOpacity>
          {expanded &&
            item?.order_details?.map((detail, index) => (
              <View className="bg-white rounded-md p-2  shadow-lg shadow-black/25 mb-1">
                <ProductDetail
                  key={index}
                  productId={detail?.productId}
                  quantity={detail?.quantity}
                  index={index}
                />
              </View>
            ))}
          {expanded && (
            <View className="w-full  flex-row justify-end items-center my-5 pr-5">
              <View className="w-[60%]">
                <View className="flex-row justify-between">
                  <Text className="text-left">Tạm tổng:</Text>
                  <Text className="text-right">
                    {item?.subtotal
                      ? item?.subtotal.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : 0}{" "}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-left">Sử dụng điểm:</Text>
                  <Text className="text-right">
                    {item?.discount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-left">Tổng thành tiền:</Text>
                  <Text className="text-right">
                    {item?.total
                      ? item?.total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : 0}{" "}
                  </Text>
                </View>
              </View>
            </View>
          )}
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
    width: "100%",
    backgroundColor: "#ffffff",
    marginBottom: 10,
    borderRadius: 8,
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

export default OrderItem;
