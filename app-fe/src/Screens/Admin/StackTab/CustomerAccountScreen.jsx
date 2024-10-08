import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { useGetCustomers } from "../../../API/customerApi";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { Searchbar, Title } from "react-native-paper";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

const ManageCustomer = () => {
  const { data: customers, isLoading, error } = useGetCustomers();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCus, setVisibleCus] = useState(3); // Số sản phẩm hiển thị ban đầu

  const navigation = useNavigation(); // Initialize useNavigation hook

  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredSearch = customers?.filter(
    (item) =>
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sắp xếp danh sách đơn hàng theo created_at từ mới nhất đến cũ nhất
  filteredSearch?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.customerCard}>
      <View className="flex-row ">
        <Text className="font-semibold mr-4">#{index + 1}</Text>
        <View className="w-[90%]">
          <View className="flex-row justify-between">
            <Text style={styles.customerName}>{item.name}</Text>
            <Text className="text-[#937C00] font-semibold">
              {item.points} Điểm{" "}
            </Text>
          </View>
          <Text style={styles.customerPhone}>{item.phone}</Text>
          <Text style={styles.customerEmail}>{item.email}</Text>
          <Text className="mb-2 text-xs text-right">
            Ngày tạo: {moment(item.createdAt).format("DD/MM/YYYY, hh:mm A")}{" "}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.viewDetailButton}
        onPress={() =>
          navigation.navigate("CustomerDetail", { customerId: item._id })
        }
      >
        <Text style={styles.viewDetailButtonText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Có lỗi xảy ra khi tải dữ liệu khách hàng.</Text>;

  const handleLoadMore = () => {
    setVisibleCus(visibleCus + 3); // Tăng số lượng sản phẩm hiển thị khi nhấn nút "Xem thêm"
  };

  const renderFooter = () => {
    // Kiểm tra nếu không còn sản phẩm để hiển thị thì không hiển thị nút "Xem thêm"
    if (visibleCus >= filteredSearch.length) {
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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer} className="items-center">
        <Searchbar
          placeholder="Tìm tên, email hoặc số điện thoại ..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          className="h-12"
        />
      </View>
      {customers && (
        <Text className="my-2 ml-2 font-semibold">
          Tổng có: {customers.length} Khách hàng
        </Text>
      )}
      <FlatList
        data={filteredSearch.slice(0, visibleCus)}
        ListFooterComponent={renderFooter} // Thêm footer cho FlatList
        renderItem={renderItem}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  customerCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  customerPhone: {
    marginBottom: 4,
  },
  customerEmail: {
    marginBottom: 10,
  },
  viewDetailButton: {
    backgroundColor: "#ccac00",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  viewDetailButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ManageCustomer;
