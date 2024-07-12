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
import {
  useCancelOrder,
  useConfirmOrder,
  useGetAllOrders,
} from "../../../API/order";
import { Button, Modal, Portal, Searchbar, Title } from "react-native-paper";
import { useGetMyProfile } from "../../../API/staffApi";
// import useResetScreen from "../Component/useResetScreen";

const OrderManagementScreenAdmin = () => {
  const { data: orders, isLoading, error } = useGetAllOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleOrders, setVisibleOrders] = useState(5); // Số sản phẩm hiển thị ban đầu
  const { data: info } = useGetMyProfile();

  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredOrder = orders?.filter((item) =>
    item.order_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sắp xếp danh sách đơn hàng theo created_at từ mới nhất đến cũ nhất
  filteredOrder?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const handleLoadMore = () => {
    setVisibleOrders(visibleOrders + 5); // Tăng số lượng sản phẩm hiển thị khi nhấn nút "Xem thêm"
  };

  const { mutate: confirmOrder } = useConfirmOrder();
  const { mutate: cancelOrder } = useCancelOrder();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToProcess, setOrderToProcess] = useState(null);

  const handleConfirmOrder = () => {
    confirmOrder(orderToProcess);
    setShowConfirmModal(false);
  };

  const handleCancelOrder = () => {
    cancelOrder(orderToProcess);
    setShowCancelModal(false);
  };

  const renderFooter = () => {
    if (!filteredOrder || visibleOrders >= filteredOrder.length) {
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
    console.error("Error loading orders:", error.message);
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
        />
      </View>
      {orders && (
        <Text className="my-2 ml-2 font-semibold">
          Tổng có: {orders.length} đơn hàng
        </Text>
      )}
      {filteredOrder.length !== 0 && (
        <FlatList
          data={filteredOrder?.slice(0, visibleOrders)} // Hiển thị số sản phẩm tối đa
          ListFooterComponent={renderFooter} // Thêm footer cho FlatList
          renderItem={({ item, index }) => (
            <OrderItem item={item} index={index} info={info} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  addButton3: {
    backgroundColor: "#ccac00",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "30%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton1: {
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "30%",
    alignItems: "center",
  },
});

export default OrderManagementScreenAdmin;
