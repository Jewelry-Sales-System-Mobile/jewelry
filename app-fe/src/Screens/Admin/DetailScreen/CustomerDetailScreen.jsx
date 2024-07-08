import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  useGetCustomerById,
  useGetOrdersByCustomerId,
} from "../../../API/customerApi";
import moment from "moment";
import { useGetProductById } from "../../../API/productApi";
import { Title } from "react-native-paper";

const CustomerDetailScreen = () => {
  const route = useRoute();
  const { customerId } = route.params;
  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
  } = useGetCustomerById(customerId);
  const [limit, setLimit] = useState(3);
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetOrdersByCustomerId(customerId); // Use the new API hook

  console.log("orders", orders);

  if (customerLoading || ordersLoading) return <Text>Loading...</Text>;
  if (customerError || ordersError)
    return (
      <Text>Có lỗi xảy ra khi tải chi tiết khách hàng hoặc đơn hàng.</Text>
    );

  const handleLoadMore = () => {
    // Increase the limit by 3 each time the user wants to load more
    setLimit(limit + 3);
  };

  const renderFooter = () => {
    // Check if there are more products to show
    if (limit >= orders.length) {
      return null; // Don't show the "Load More" button if no more products
    }

    return (
      <TouchableOpacity
        className="bg-[#ccac00] rounded-md p-1 text-center w-[40%] mt-4 mx-auto"
        onPress={handleLoadMore}
      >
        <Title className="text-white text-center text-sm text-semibold">
          Xem thêm
        </Title>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://static.vecteezy.com/system/resources/thumbnails/019/576/577/small/abstract-white-wavy-ripple-pattern-background-curve-line-texture-for-modern-graphic-design-element-website-banner-and-poster-or-business-card-decoration-vector.jpg",
        }}
        style={styles.customerDetailCard}
        imageStyle={{ borderRadius: 8 }}
      >
        <View className="flex-row justify-between">
          <Text style={styles.detailTitle}>{customer.name}</Text>
          <Text className="text-[#937C00] text-lg font-bold">
            {customer.points} Điểm{" "}
          </Text>
        </View>

        <View style={styles.detailText} className="flex-row">
          <Text className="text-base mr-2 font-semibold">Ngày sinh:</Text>
          <Text className="text-base ">
            {moment(customer.dob).format("DD/MM/YYYY")}
          </Text>
        </View>
        <View style={styles.detailText} className="flex-row">
          <Text className="text-base mr-2 font-semibold">Số điện thoại:</Text>
          <Text className="text-base ">{customer.phone}</Text>
        </View>

        <View className="flex-row mb-4">
          <Text className="text-base mr-2 font-semibold">Email:</Text>
          <Text className="text-base ">{customer.email}</Text>
        </View>

        <Text className="text-xs text-gray">
          Ngày tạo: {moment(customer.createdAt).format("DD/MM/YYYY, hh:mm A")}
        </Text>
        <Text className="text-xs text-gray">
          Ngày sửa lần cuối:{" "}
          {moment(customer.updatedAt).format("DD/MM/YYYY, hh:mm A")}
        </Text>
      </ImageBackground>

      <Text className="uppercase font-semibold text-sm mb-5">
        Danh sách đơn hàng của {customer.name}:
      </Text>

      <View
        className="bg-white rounded-md flex"
        style={styles.orderListContainer}
      >
        <FlatList
          data={orders.slice(0, limit)}
          renderItem={({ item, index }) => (
            <OrderItem item={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.orderListContainer}
          ListFooterComponent={renderFooter} // Add footer to FlatList
          ind
        />
      </View>
    </View>
  );
};

const OrderItem = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);

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
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          {/* <Text className="font-semibold text-sm mr-2">#{index + 1}</Text> */}
          <Image
            source={{ uri: getStatusImage(item.paymentStatus) }}
            style={styles.image}
          />
          <Text
            className=" ml-2 font-semibold text-lg self-start "
            style={[getStatusTextStyle(item.paymentStatus)]}
          >
            {getStatusText(item.paymentStatus)}
          </Text>
        </View>
        <Text className="ml-2 font-semibold text-base  self-start">
          #{item.order_code}
        </Text>
      </View>
      <Text className="text-xs text-gray  ml-8">
        {moment(item.created_at).format("DD/MM/YYYY, hh:mm A")}
      </Text>
      <Text className="text-base font-semibold text-[#937C00] my-2 ml-8">
        {item.total
          ? item.total.toLocaleString("vi-VN", {
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
        item.order_details.map((detail, index) => (
          <View className="bg-white rounded-md p-2  shadow-lg shadow-black/25">
            <ProductDetail
              key={index}
              productId={detail.productId}
              quantity={detail.quantity}
              index={index}
            />
            <View className="w-full  flex-row justify-end items-center my-5 pr-5">
              <View className="w-[60%]">
                <View className="flex-row justify-between">
                  <Text className="text-left">Tạm tổng:</Text>
                  <Text className="text-right">
                    {item.subtotal
                      ? item.subtotal.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : 0}{" "}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-left">Sử dụng điểm:</Text>
                  <Text className="text-right">
                    {item.discount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-left">Tổng thành tiền:</Text>
                  <Text className="text-right">
                    {item.total
                      ? item.total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : 0}{" "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
};

const ProductDetail = ({ productId, quantity, index }) => {
  const { data: product, isLoading, error } = useGetProductById(productId);

  console.log("product", product);

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
    <View className="flex-row w-full">
      <Text className="mr-2 font-semibold">{index + 1}.</Text>
      <Image
        source={{
          uri: product.image
            ? product.image
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJRS-4chjWMRAmrtz7ivK53K_uygrgjzw9Uw&s",
        }}
        style={styles.productImage}
      />
      <View className="w-[75%]">
        <Text className="font-semibold">
          [{product.productCode}] - {product.name}
        </Text>

        <Text className="text-xs"> {product.weight} gram</Text>
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

export default CustomerDetailScreen;
