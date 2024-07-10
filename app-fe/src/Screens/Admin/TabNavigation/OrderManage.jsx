// OrderManagementScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import { useGetAllOrders } from "../../../API/orderApi";
import OrderItem from "../Component/orderItem";
import { useGetAllOrders } from "../../../API/order";
import { Searchbar, Title } from "react-native-paper";

const OrderManagementScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleOrders, setVisibleOrders] = useState(5); // Số sản phẩm hiển thị ban đầu

  console.log("ordersMana", orders);

  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredOrder = orders?.filter((item) =>
    item.order_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleOrders(visibleOrders + 5); // Tăng số lượng sản phẩm hiển thị khi nhấn nút "Xem thêm"
  };

  const renderFooter = () => {
    // Kiểm tra nếu không còn sản phẩm để hiển thị thì không hiển thị nút "Xem thêm"
    if (visibleOrders >= filteredOrder.length) {
      return null;
    }

    return (
      <TouchableOpacity
        className="bg-[#ccac00] rounded-md p-1 text-center w-[40%] mt-4 mx-auto"
        onPress={handleLoadMore}
      >
        <Title className="text-white text-center text-sm text-semibold">
          Xem thêm
        </Title>
      </TouchableOpacity>
    );
  };

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
      <View style={styles.searchContainer} className="items-center">
        <Searchbar
          placeholder="Tìm mã đơn hàng..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          // className="shadow-md"
        />
      </View>
      {orders && (
        <Text className="my-2 ml-2 font-semibold">
          Tổng có: {orders.length} đơn hàng
        </Text>
      )}
      <FlatList
        data={filteredOrder.slice(0, visibleOrders)} // Hiển thị số sản phẩm tối đa
        ListFooterComponent={renderFooter} // Thêm footer cho FlatList
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "between",
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    width: "90%",
  },
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
