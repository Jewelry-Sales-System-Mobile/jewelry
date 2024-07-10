import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useCartStore } from "../../../Zustand/CartForStaff.js";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../Utils/notifications.js";
import { useMakerOrder } from "../../../API/order.js";

const OrderManagementScreen = () => {
  const {
    customer_id,
    order_details,
    subtotal,
    discount,
    total,
    applyDiscount,
  } = useCartStore();
  const { mutate: makerOrder } = useMakerOrder();
  console.log("order_details_manage", order_details);
  const CheckOut = () => {
    const checkOut = {
      customer_id: customer_id,
      order_details: order_details,
      discount: discount,
      subtotal: subtotal,
      total: total,
    };
    if (checkOut.order_details.length === 0 && checkOut.total === 0) {
      console.log("No product in cart");
      showErrorMessage("No product in cart");
    } else if (checkOut.customer_id === "") {
      showErrorMessage("No customer selected");
      console.log("No customer selected");
    } else {
      makerOrder(checkOut);
    }
  };
  return (
    <View>
      <Text className="m-3">Manage Order</Text>
      <Text className="m-3">Customer: {customer_id}</Text>
      {order_details.map((item) => (
        <View className="m-3 flex flex-row">
          <Text className="m-3">{item.name}</Text>
          <Text className="m-3">{item.productCode}</Text>
          <Text className="m-3">{item.weight}</Text>

          <View>
            <Text className="m-3">{item.quantity}</Text>
          </View>
          <Text className="m-3">
            {Math.round(item.unitPrice / 1000) * 1000}
          </Text>
        </View>
      ))}
      <Text className="m-3">subtotal:{Math.round(subtotal / 1000) * 1000}</Text>
      <View>
        <Text className="m-3">Áp Dụng giảm giá:{discount}</Text>
        <TouchableOpacity onPress={() => applyDiscount(100)}>
          <Text>Áp Dụng</Text>
        </TouchableOpacity>
      </View>
      <Text className="m-3">total:{Math.round(total / 1000) * 1000}</Text>
      <TouchableOpacity onPress={() => CheckOut()}>
        <Text>Thanh Toán</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderManagementScreen;
