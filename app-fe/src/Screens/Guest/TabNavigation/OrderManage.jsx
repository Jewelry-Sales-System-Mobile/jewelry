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
import { Feather } from "@expo/vector-icons";

const OrderManagementScreen = () => {
  const {
    customer,
    order_details,
    subtotal,
    discount,
    total,
    applyDiscount,
    increaseDiscount,
    decreaseDiscount,
    setCustomer,
  } = useCartStore();
  const { mutate: makerOrder } = useMakerOrder();
  const navigation = useNavigation();

  const CheckOut = () => {
    const checkOut = {
      customer_id: customer._id,
      order_details: order_details,
      discount: discount,
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
  const handleDecreaseDiscount = () => {
    console.log("decrease");
    decreaseDiscount();
  };

  const handleIncreaseDiscount = () => {
    console.log(
      "increase",
      discount + 100000,
      customer.points * 1000,
      discount + 100000 < customer.points * 1000
    );
    if (customer.points > 100 && discount + 100000 < customer.points * 1000) {
      console.log("increase", discount, customer.points);
      increaseDiscount();
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
        <View className="flex flex-row">
          <View className="mb-3">
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
          <TouchableOpacity onPress={() => setCustomer("")}>
            <Feather name="x-circle" size={21} color="red"></Feather>
          </TouchableOpacity>
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
            renderItem={({ item }) => <OrderCard item={item} />}
            ListFooterComponent={() =>
              customer !== "" && order_details.length > 0 ? (
                <View className="flex-1 items-end m-5 mb-5">
                  <Text className="mx-3 my-1 text-lg">
                    Tạm Tính:{" "}
                    {(Math.round(subtotal / 1000) * 1000).toLocaleString()}đ
                  </Text>
                  <View className="w-2/3 flex flex-row">
                    <View className="w-1/3">
                      <Text className="text-center text-base text-slate-500">
                        Giảm giá:{" "}
                      </Text>
                    </View>
                    <View className="w-1/6 flex item-center mx-auto">
                      <TouchableOpacity
                        onPress={handleDecreaseDiscount}
                        className="flex item-center mx-auto  mt-1"
                      >
                        <Feather
                          name="minus"
                          size={13}
                          className="text-center"
                          color={"red"}
                        />
                      </TouchableOpacity>
                    </View>
                    <View className="w-1/3">
                      <Text className="text-center text-base text-orange-500">
                        {discount.toLocaleString()}đ
                      </Text>
                    </View>
                    <View className="w-1/6 flex item-center mx-auto">
                      <TouchableOpacity
                        onPress={handleIncreaseDiscount}
                        className="flex item-center mx-auto  mt-1"
                      >
                        <Feather
                          name="plus"
                          size={13}
                          className="text-center"
                          color={"green"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text className="mx-3 my-1 text-xs text-slate-500">
                    Tối đa: {(customer.points * 1000).toLocaleString()}đ
                  </Text>
                  <Text className="m-3 text-xl ">
                    Tổng tiền:{" "}
                    {(Math.round(total / 1000) * 1000).toLocaleString()}
                  </Text>
                  <TouchableOpacity onPress={CheckOut}>
                    <Text className="bg-yellow-500 font-bold text-white text-lg px-3 py-2 rounded-xl">
                      Thanh Toán
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        </>
      )}
    </View>
  );
};

export default OrderManagementScreen;
