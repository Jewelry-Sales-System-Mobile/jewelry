import React from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import GoldPriceManagement from "../Component/GoldPriceSection";
import RevenueChart from "../Component/RevenueChart";
import VIPCustomerStats from "../DetailScreen/VIPCustomerStats";

// const DashboardScreen = () => {
//   return (
//     <ScrollView
//       contentContainerStyle={{
//         flexGrow: 1,
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//       className="mt-5"
//     >
//       <GoldPriceManagement />
//       <RevenueChart />
//       <VIPCustomerStats />
//     </ScrollView>
//   );
// };

const DashboardScreen = () => {
  // Replace this with your actual data
  const data = [1]; // Example data

  const renderItem = () => (
    <View className="mt-5 items-center">
      <GoldPriceManagement />
      {/* <RevenueChart /> */}
      <VIPCustomerStats />
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
