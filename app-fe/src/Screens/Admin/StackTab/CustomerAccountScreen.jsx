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
import { Searchbar } from "react-native-paper";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

const ManageCustomer = () => {
  const { data: customers, isLoading, error } = useGetCustomers();
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation(); // Initialize useNavigation hook

  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredSearch = customers?.filter(
    (item) =>
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <FlatList
        data={filteredSearch}
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
