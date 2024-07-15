import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGetStaffById } from "../../API/staffApi";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function EmployeeDetails({
  employeeId,
  onUnassign,
  index,
  navigation,
}) {
  const { data: employeeData, isLoading, error } = useGetStaffById(employeeId);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    console.error("Error loading employee data:", error);
    return <Text>Error loading employee data</Text>;
  }

  return (
    <View className="flex flex-row justify-between w-full items-center border-t-2 border-neutral-300 py-3">
      <View className="flex flex-row items-center gap-3">
        <Text className="bg-amber-200 py-4 px-2 rounded-lg">{index + 1}</Text>
        <View className="flex flex-col">
          <Text
            className="text-base font-semibold underline"
            onPress={() =>
              navigation.navigate("StaffDetail", {
                staffId: employeeData._id,
              })
            }
          >
            {employeeData?.name}
          </Text>
          <Text>{employeeData?.email}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => onUnassign(employeeId)}>
        <Ionicons name="trash-outline" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );
}
