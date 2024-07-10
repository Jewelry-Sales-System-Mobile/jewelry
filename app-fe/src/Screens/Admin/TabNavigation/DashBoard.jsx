import React from "react";
import { View, Text, ScrollView } from "react-native";
import GoldPriceManagement from "../Component/GoldPriceSection";
import RevenueChart from "../Component/RevenueChart";
import VIPCustomerStats from "../DetailScreen/VIPCustomerStats";

const DashboardScreen = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      className="mt-5"
    >
      {/* <Text style={{ fontSize: 24, marginBottom: 20 }}>Dashboard</Text> */}
      <GoldPriceManagement />
      <RevenueChart />
      <VIPCustomerStats />
      {/* Các thành phần khác của dashboard */}
    </ScrollView>
  );
};

export default DashboardScreen;
