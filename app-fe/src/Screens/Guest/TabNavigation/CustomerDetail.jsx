import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function CustomerDetail() {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <View className="w-full h-full bg-white">
      <View className="flex flex-row border-b-[1px] border-slate-300 p-4">
        <Pressable onPress={handleBack}>
          <Icon name="arrow-back" size={27} />
        </Pressable>
        <Text className="text-xl ml-4 text-center">Danh sách đơn hàng</Text>
      </View>
    </View>
  );
}
