import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useCartStore } from "../../../Zustand/CartForStaff.js";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../Utils/notifications.js";
import { useMakerOrder } from "../../../API/order.js";
import OrderCard from "../../../components/Staff/OrderManage/OrderCard.jsx";
import { useNavigation } from "@react-navigation/native";

const OrderManagementScreen = () => {
  const { customer, order_details, subtotal, discount, total, applyDiscount } =
    useCartStore();
  const { mutate: makerOrder } = useMakerOrder();
  const navigation = useNavigation();

  const CheckOut = () => {
    const checkOut = {
      customer_id: customer._id,
      order_details: order_details,
      discount: applyDiscount,
      subtotal: subtotal,
      total: total,
    };
    if (checkOut.order_details.length === 0 && checkOut.total === 0) {
      console.log("No product in cart");
      showErrorMessage("No product in cart");
    } else if (!checkOut.customer_id) {
      showErrorMessage("No customer selected");
      console.log("No customer selected");
    } else {
      // console.log(checkOut.customer_id);
      makerOrder(checkOut);
    }
  };
  const setDiscount = () => {
    if (customer.points > 100 && discount === 0) {
      if (total < customer.points * 1000) {
        console.log("total", total, customer.points * 1000);
        applyDiscount(total);
      } else {
        applyDiscount(customer.points * 1000);
      }
    } else {
      applyDiscount(0);
    }
  };
  return (
    <View className="flex bg-white h-full">
      <Text className=" text-2xl font-bold my-6 text-center">Tạo Đơn Hàng</Text>
      {customer === "" ? (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Customer")}
            className="w-1/2 flex"
          >
            <Text className="ml-3 my-1 text-lg bg-yellow-600 text-white font-bold px-3 py-2 text-center rounded-xl">
              Chọn Khách Hàng
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="mb-3 ">
          <Text className="ml-3 my-1 text-base">
            Tên Khách Hang: {customer.name}
          </Text>
          <Text className="ml-3 mb-1 text-sm text-slate-500">
            Số điện thoại: {customer.phone}
          </Text>
          <Text className="ml-3 mb-1 text-sm text-slate-500">
            Email: {customer.email}
          </Text>
        </View>
      )}

      {order_details.length === 0 ? (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Product")}
            className="w-1/2 flex"
          >
            <Text className="ml-3 mt-5 text-lg bg-yellow-600 text-white font-bold px-3 py-2 text-center rounded-xl">
              Chọn Sản Phẩm
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="m-3 flex flex-row border-b-[1px] border-slate-300 mx-2 py-1">
            <View className="w-5/12">
              <Text className="text-center text-sm text-slate-600">Tên</Text>
            </View>
            <View className="w-3/12">
              <Text className="text-center text-sm text-slate-600">
                Số Lượng
              </Text>
            </View>
            <View className="w-3/12">
              <Text className="text-center text-sm text-slate-600">
                Đơn Giá
              </Text>
            </View>
            <View className="w-1/12">{/* <Text>Ten</Text> */}</View>
          </View>
          <FlatList
            data={order_details}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              // Your component or JSX to render each item
              <OrderCard item={item} />
            )}
          />
        </>
      )}
      {customer !== "" && order_details.length > 0 ? (
        <View className="flex-1 items-end m-5 mb-5">
          <Text className="mx-3 my-1 text-lg">
            Tạm Tính: {(Math.round(subtotal / 1000) * 1000).toLocaleString()}đ
          </Text>
          {/* <View className="flex justify-end"> */}
          <Text className="mx-3 text-base text-slate-400">
            Giảm giá:
            {customer.points > 0
              ? (customer.points * 1000).toLocaleString() + "đ"
              : "0"}
          </Text>
          <TouchableOpacity className="" onPress={() => setDiscount()}>
            {customer.points > 100 && discount === 0 ? (
              <Text className=" bg-orange-500 text-xs rounded-xl px-3 py-1 text-white font-bold">
                Áp Dụng
              </Text>
            ) : customer.points < 100 ? (
              ""
            ) : (
              <Text className=" bg-white-500 border-[1px] border-red-500 text-xs rounded-xl px-3 py-1 text-red-500 font-bold">
                Bỏ Áp Dụng
              </Text>
            )}
          </TouchableOpacity>
          {/* </View> */}
          <Text className="m-3 text-xl ">
            Tổng tiền: {(Math.round(total / 1000) * 1000).toLocaleString()}
          </Text>
          <TouchableOpacity onPress={() => CheckOut()}>
            <Text className="bg-yellow-500 font-bold text-white text-lg px-3 py-2 rounded-xl">
              Thanh Toán
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        ""
      )}
    </View>
  );
};

export default OrderManagementScreen;
