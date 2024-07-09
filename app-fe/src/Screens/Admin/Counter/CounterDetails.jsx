import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useDeleteCounter, useGetCounterById } from "../../../API/counter";
import { useRoute, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function CounterDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: counterId } = route.params;
  const { data, isLoading, error } = useGetCounterById(counterId);
  const { mutate: deleteCounter } = useDeleteCounter({
    onSuccess: () => {
      navigation.navigate("Counter");
    },
  });



  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.error("Error loading counters:", error);
    return (
      <View>
        <Text>Error loading data: {error.message}</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteCounter(counterId);
  };



  return (
    <View className="p-3 bg-white flex-1">
      <View className="bg-red-100 indeterminate:flex border-t-2 border-neutral-200 px-6 pt-5 pb-3 rounded-lg shadow-lg shadow-black/25 mb-3">
        <View className="flex flex-row justify-between">
          <Text>
            Tên quầy:{" "}
            <Text className="font-semibold text-base">
              {data?.counter_name}
            </Text>
          </Text>
          <TouchableOpacity onPress={() =>
                navigation.navigate("Cập nhật thông tin quầy hàng", { id: data?._id })
              } className="flex flex-row">
            <Text className="italic text-blue-700 text-base">Thay đổi</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              color="#A6A5A5"
            />
          </TouchableOpacity>
        </View>

        
      </View>

      <View className="px-4 mb-5 mt-4">
        <Text className="uppercase font-medium text-lg mb-2">
          Thông tin quầy hàng
        </Text>
        <View className="flex flex-row justify-between px-6 mb-2">
          <Text>Ngày tạo:</Text>
          <Text>{format(new Date(data?.created_at), "dd-MM-yyyy HH:mm")}</Text>
        </View>
        <View className="flex flex-row justify-between px-6">
          <Text>Cập nhật lần cuối:</Text>
          <Text>{format(new Date(data?.updated_at), "dd-MM-yyyy HH:mm")}</Text>
        </View>
      </View>

      <View className="px-4 mt-4">
        <Text className="uppercase font-medium text-lg mb-2">
          Nhân viên phụ trách
        </Text>
        {data?.assignedEmployees.length === 0 ? (
          <View className="items-center my-3">
            <Ionicons name="file-tray" size={50} color="#A6A5A5" />
            <Text className="text-base italic text-red-400 font-medium">
              Chưa có thông tin
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Phân công nhân viên", { id: data?._id })
              }
              className="bg-slate-400 rounded-lg w-fit items-center mx-auto px-7 py-2 mt-4 mb-2"
            >
              <Text className="uppercase font-semibold text-base">
                Phân công
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex flex-row justify-between px-6 mb-2">
            <Text>ID nhân viên:</Text>
            <Text>{data?.assignedEmployees}</Text>
          </View>
        )}
      </View>

      <View className=" absolute bottom-5 left-0 right-0 items-center">
        <TouchableOpacity
          onPress={handleDelete}
          className="flex flex-row bg-red-400 w-fit mx-auto px-8 py-3 rounded-lg"
        >
          {/* <MaterialCommunityIcons
            name="trash-can-outline"
            size={25}
            color="red"
          /> */}
          <Text className="text-base font-semibold ">Xoá quầy hàng</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}
