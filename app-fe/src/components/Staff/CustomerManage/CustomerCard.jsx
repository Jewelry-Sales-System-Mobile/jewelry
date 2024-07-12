import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { useCartStore } from "../../../Zustand/CartForStaff";

export default function CustomerCard({ item }) {
  const navigation = useNavigation();
  const { setCustomerId } = useCartStore();

  const selectCustomer = () => {
    console.log("selectCustomer", item);
    setCustomerId(item); // Assuming item._id is the customer ID you want to set
    navigation.navigate("Order"); // Navigate to CustomerDetail screen
  };

  return (
    <View className="flex w-full px-2">
      <View
        className="bg-white flex border-[1px] border-neutral-200 px-6 py-3 rounded-lg shadow-lg shadow-black/25 mb-4"
        // onPress={() => navigation.navigate("CustomerDetail", { id: item._id })}
      >
        {item && (
          <View className="w-full">
            <View className="flex flex-row justify-between">
              <Text
                className="text-lg line-clamp-1 text-[#937C00] underline w-3/4 font-bold mb-2"
                numberOfLines={1}
                ellipsizeMode="tail"
                onPress={() =>
                  navigation.navigate("CustomerDetail", {
                    customerId: item?._id,
                  })
                }
              >
                {item?.name}
              </Text>
              <Text className="text-lg text-right w-full font-semibold text-[#937C00]">
                {item?.points} Điểm
              </Text>
            </View>
            <View className="mb-2">
              <Text className=" text-slate-500">{item?.phone}</Text>
            </View>
            <View className="mb-2">
              <Text className=" text-slate-500">{item?.email}</Text>
            </View>
            <View className="mb-2">
              <Text>
                Cập nhật lần cuối:{" "}
                {format(new Date(item?.updatedAt), "dd-MM-yyyy HH:mm")}
              </Text>
            </View>
            <TouchableOpacity onPress={selectCustomer}>
              <Text className="text-center my-2 rounded-2xl py-2 text-white  bg-yellow-600">
                Tạo đơn hàng
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={() =>
              navigation.navigate("CustomerDetails", { id: item._id })
            }
          >
            <Text className="text-center my-2 rounded-2xl py-2 text-white  bg-yellow-600">
              Xem đơn hàng
            </Text>
          </TouchableOpacity> */}
          </View>
        )}
      </View>
    </View>
  );
}
