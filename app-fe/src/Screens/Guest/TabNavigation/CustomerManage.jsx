import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetCustomers } from "../../../API/customer";
import CustomerCard from "../../../components/Staff/CustomerManage/CustomerCard";
import { Searchbar, Modal, Title } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AddCusModal from "../../../components/Staff/CustomerManage/AddCusModal";
import { set } from "date-fns";

export default function CustomerManagementScreen() {
  const [showAll, setShowAll] = useState(false);
  const { data: customers, isLoading, error } = useGetCustomers();
  const [displayedData, setDisplayedData] = useState([]);

  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search.toLowerCase()); // Convert search term to lowercase for case-insensitive comparison
  };
  useFocusEffect(
    useCallback(() => {
      if (!isLoading && customers) {
        // Example filtering logic: filter customers based on a search term
        // This needs to be adjusted based on the actual structure of customer objects and how you want to filter them
        const filteredCustomers = customers.filter((customer) => {
          return (
            customer?.phone.includes(search) ||
            customer?.name.toLowerCase().includes(search) ||
            customer?.email.toLowerCase().includes(search)
          );
        });

        // Set displayed data based on showAll flag and search filter
        setDisplayedData(
          showAll || !Array.isArray(customers)
            ? filteredCustomers
            : filteredCustomers.slice(0, 6)
        );

        // setDisplayedData(customers);
        console.log("displayedData", customers, filteredCustomers);
      } else {
        setDisplayedData([]);
      }
    }, [showAll, customers, search]) // Include search in the dependency array
  );
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);

  // Hàm mở modal
  const openModalAdd = () => {
    setModalVisibleAdd(true);
  };

  // Hàm đóng modal
  const closeModalAdd = () => {
    setModalVisibleAdd(false);
    // Đặt lại thông tin sản phẩm mới về trạng thái ban đầu khi đóng modal
  };
  // console.log(customers, isLoading, error);
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.error("Error loading counters:", error);
    return (
      <View>
        <Text>Error loading data: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white flex flex-1 justify-center w-full">
      <View className="bg-white flex flex-1 items-center mt-3 w-full ">
        <View className="flex-row p-2 justify-between">
          <Text className="text-xl mr-5 font-bold mb-5 mt-2.5">
            Quản lý danh sách khách hàng
          </Text>
          <View
            className="flex-row items-center justify-end mt-2.5 z-10"
            onPress={openModalAdd}
          >
            <TouchableOpacity
              className="flex-row bg-[#ccac00] p-2 rounded-md mb-4"
              onPress={openModalAdd}
            >
              <FontAwesome name="plus" size={16} color="white" />
              {/* <Text style={{ color: "white", marginLeft: 10 }}>Tạo Sản Phẩm</Text> */}
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row w-full border-b-[1px] border-slate-400 pb-2 mb-3">
          <View className="m-1 rounded-xl w-10/12 bg-white">
            <Searchbar
              placeholder="Tìm bằng tên, sđt hoặc email..."
              onChangeText={updateSearch}
              value={search}
              containerStyle={"bg-white"}
              inputContainerStyle="bg-white rounded-xl"
              className="w-full"
            />
          </View>
          <View className="w-1/6 justify-center items-center">
            <Text className="text-center">Filter</Text>
          </View>
        </View>

        <FlatList
          style={{ width: "93%" }}
          data={displayedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            // Your component or JSX to render each item
            <CustomerCard item={item} />
          )}
        />

        {!showAll && customers.length > 6 && (
          <Pressable
            onPress={() => setShowAll(true)}
            className="mb-5 items-center p-5"
          >
            <Text className="font-semibold italic">Xem thêm...</Text>
          </Pressable>
        )}
        <AddCusModal
          modalVisibleAdd={modalVisibleAdd}
          closeModalAdd={closeModalAdd}
          openModalAdd={openModalAdd}
        />
      </View>
    </SafeAreaView>
  );
}
