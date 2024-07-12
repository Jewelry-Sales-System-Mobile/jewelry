import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Combined Component with NativeWind classNames adjustments
export default function OrderSuccess({ route }) {
  const { orderData } = route.params;
  const item = orderData.data;
  const navigate = useNavigation();
  console.log("item", item);
  // const item = {
  //   _id: "669183d9b48835d48de75681",
  //   customer_id: "668cf97a634191de84f39587",
  //   staff_id: "668dad191c96b0372c6fc84e",
  //   order_details: [
  //     {
  //       _id: "668ecb1a9dceec34f07c614b",
  //       name: "Khuyên tai trơn",
  //       barcode: "",
  //       productCode: "PD474327",
  //       weight: 0.2,
  //       laborCost: 1280.0000000000002,
  //       gemCost: 50000,
  //       basePrice: 477946.66666666674,
  //       image: "",
  //       created_at: "2024-07-10T17:55:38.224Z",
  //       updated_at: "2024-07-12T10:23:56.864Z",
  //       status: 0,
  //       image_url:
  //         "https://image-storage-nghich.s3.ap-southeast-1.amazonaws.com/b84608dbf8ce62a002c389a06.jpg",
  //       productId: "668ecb1a9dceec34f07c614b",
  //       unitPrice: 477946.66666666674,
  //       quantity: 1,
  //     },
  //     {
  //       _id: "668ecb1a9dceec34f07c614b",
  //       name: "Khuyên tai trơn",
  //       barcode: "",
  //       productCode: "PD474327",
  //       weight: 0.2,
  //       laborCost: 1280.0000000000002,
  //       gemCost: 50000,
  //       basePrice: 477946.66666666674,
  //       image: "",
  //       created_at: "2024-07-10T17:55:38.224Z",
  //       updated_at: "2024-07-12T10:23:56.864Z",
  //       status: 0,
  //       image_url:
  //         "https://image-storage-nghich.s3.ap-southeast-1.amazonaws.com/b84608dbf8ce62a002c389a06.jpg",
  //       productId: "668ecb1a9dceec34f07c614b",
  //       unitPrice: 477946.66666666674,
  //       quantity: 1,
  //     },
  //   ],
  //   order_code: "OD031121",
  //   subtotal: 477946.66666666674,
  //   discount: null,
  //   total: 477946.66666666674,
  //   paymentStatus: 0,
  //   created_at: "2024-07-12T19:28:25.851Z",
  //   updated_at: "2024-07-12T19:28:25.851Z",
  // };
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

  const getStatusClassName = (status) => {
    switch (status) {
      case 0:
        return "text-yellow-500"; // Màu vàng đậm cho trạng thái chờ thanh toán
      case 1:
        return "text-green-700"; // Màu xanh lá đậm cho trạng thái đã thanh toán
      case 2:
        return "text-red-700"; // Màu đỏ đậm cho trạng thái trả hàng
      default:
        return "";
    }
  };

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "0 VND";
    const numValue = Number(value); // Convert value to a number
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue.toFixed(2));
  };

  // if (isLoading) return <Text>Loading...</Text>;
  // if (error) return <Text>Có lỗi xảy ra khi tải thông tin sản phẩm.</Text>;

  // const formattedPrice = formatCurrency(detail?.basePrice);

  return (
    <View className=" bg-white h-full flex">
      <View className="border-b border-gray-300 py-2 w-4/5 mx-auto">
        <View className="flex my-12">
          <Text className="text-center">
            <Feather
              name="check-circle"
              size={79}
              className="text-center"
              color={"green"}
            />
          </Text>

          <Text className="text-center text-lg">Tạo đơn hàng thành công</Text>
        </View>

        <Text className="text-center text-xl font-bold mb-4">
          Thông tin đơn hàng
        </Text>
        {/* <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Image
              source={{ uri: getStatusImage(item.paymentStatus) }}
              className="w-5 h-5 mr-1"
            />
            <Text
              className={`ml-2 font-semibold text-lg self-start ${getStatusClassName(
                item.paymentStatus
              )}`}
            >
              {getStatusText(item.paymentStatus)}
            </Text>
          </View>
          <Text className="ml-2 font-semibold text-base self-start">
            #{item.order_code}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 ml-8">
          {moment(item.created_at).format("DD/MM/YYYY, hh:mm A")}
        </Text>
        <Text className="text-base font-semibold text-yellow-600 my-2 ml-8">
          {item.total
            ? item.total.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            : 0}{" "}
        </Text> */}

        {/* {item.order_details.map((detail, index) => (
          <View
            key={index}
            className="bg-white rounded-md p-2 shadow-lg shadow-black/25"
          >
            <View className="flex-row w-full">
              <Text className="mr-2 font-semibold">{index + 1}.</Text>
              <Image
                source={{
                  uri: detail.image_url
                    ? detail.image_url
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJRS-4chjWMRAmrtz7ivK53K_uygrgjzw9Uw&s",
                }}
                className="w-12 h-12 mr-1 bg-white"
              />
              <View className="w-3/4">
                <Text className="font-semibold">
                  [{detail.productCode}] - {detail.name}
                </Text>
                <Text className="text-xs"> {detail.weight} gram</Text>
                <View className="flex-row justify-between">
                  <Text className="text-xs">Số lượng: {detail.quantity}</Text>
                  <Text className="text-sm font-semibold">
                    {formatCurrency(detail?.basePrice)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))} */}
        <TouchableOpacity onPress={() => navigate.navigate("OrderList")}>
          <Text className="text-center text-blue-500 my-4">
            Xem danh sách đơn hàng
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
