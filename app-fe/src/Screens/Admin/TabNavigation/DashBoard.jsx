import React from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import GoldPriceManagement from "../Component/GoldPriceSection";
import RevenueChart from "../Component/RevenueChart";
import VIPCustomerStats from "../DetailScreen/VIPCustomerStats";
import { useRoute } from "@react-navigation/native";
import { useGetMyProfile } from "../../../API/staffApi";

const DashboardScreen = () => {
  // Replace this with your actual data
  const { data: info, isLoading, error } = useGetMyProfile();

  const data = [1]; // Example data

  const renderItem = () => (
    <View className="mt-5 items-center">
      <GoldPriceManagement info={info} />
      <RevenueChart info={info} />
      <VIPCustomerStats info={info} />
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.toString()}
      contentContainerStyle={{ alignItems: "center", padding: 2 }}
    />
  );
};

export default DashboardScreen;
