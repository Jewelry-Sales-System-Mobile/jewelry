import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCartStore } from "../../../Zustand/CartForStaff";

export default function OrderCard({ item }) {
  const { decreaseQuantity, increaseQuantity, deleteItem } = useCartStore();

  return (
    <View className=" flex flex-row border-b-[1px] border-slate-300 mx-2 py-1">
      <View className="w-5/12">
        <Text className="m-1 pl-2 font-bold text-slate-500 text-sm">
          {item.name}
        </Text>
        <Text className="m-1 pl-2 text-[10px] text-slate-500">
          {item.productCode}
        </Text>
        <Text className="m-1 text-xs pl-2">{item.weight} gram</Text>{" "}
      </View>
      <View className="w-3/12 flex flex-row px-2">
        <View className="w-1/3 flex item-center mx-auto">
          <TouchableOpacity
            onPress={() => decreaseQuantity(item._id)}
            className="flex item-center mx-auto  mt-1"
          >
            {" "}
            <Feather
              name="minus"
              size={13}
              className="text-center"
              color={"red"}
            />
          </TouchableOpacity>
        </View>
        <View className="w-1/3">
          <Text className="text-center">{item.quantity}</Text>
        </View>
        <View className="w-1/3 flex item-center mx-auto">
          <TouchableOpacity
            onPress={() => increaseQuantity(item._id)}
            className="flex item-center mx-auto  mt-1"
          >
            {" "}
            <Feather
              name="plus"
              size={13}
              className="text-center"
              color={"green"}
            />
          </TouchableOpacity>{" "}
        </View>
      </View>
      <View className="w-3/12 flex">
        <Text className=" mx-auto text-sm">
          {(Math.round(item.unitPrice / 1000) * 1000).toLocaleString()}
        </Text>
      </View>
      <View className="w-1/12">
        <TouchableOpacity
          onPress={() => deleteItem(item._id)}
          className="flex item-center mx-auto  mt-1"
        >
          {" "}
          <Feather
            name="trash"
            size={13}
            className="text-center"
            color={"red"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
