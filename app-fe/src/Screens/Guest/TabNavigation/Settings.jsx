import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useRoleStore } from "../../../Zustand/Role";
import { deleteAutoToken } from "../../../Utils/http";
import { showSuccessMessage } from "../../../Utils/notifications";

export default function Setttings() {
  const { setIsSignedIn } = useRoleStore();
  const logOut = () => {
    setIsSignedIn(false);
    deleteAutoToken();
    showSuccessMessage("Log Out Successfully!");
  };
  return (
    <View>
      <View className="w-1/3 flex">
        <TouchableOpacity onPress={() => logOut()}>
          <Text className="px-2 py-1 rounded-lg bg-red-500 text-white text-center">
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
