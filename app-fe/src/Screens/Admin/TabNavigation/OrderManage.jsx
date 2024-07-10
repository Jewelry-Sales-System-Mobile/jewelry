// OrderManagementScreen.js
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
// import { useGetAllOrders } from "../../../API/orderApi";
import OrderItem from "../Component/orderItem";
import { useGetAllOrders } from "../../../API/order";

const OrderManagementScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrders();

  console.log("ordersMana", orders);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading orders: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={({ item, index }) => (
          <OrderItem item={item} index={index} />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default OrderManagementScreen;
