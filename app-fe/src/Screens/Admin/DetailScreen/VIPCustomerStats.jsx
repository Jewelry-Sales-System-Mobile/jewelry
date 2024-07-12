import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import {
  useGetCustomers,
  getOrdersByCustomerId,
} from "../../../API/customerApi";
import { useNavigation } from "@react-navigation/native";

// Function to render a table
const renderTable = (data, title, keyExtractor, renderItem) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
      {title}
    </Text>
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 5 }}
    />
  </View>
);

// Component to display the VIP customer statistics
const VIPCustomerStats = () => {
  const navigation = useNavigation();

  const [topSpenders, setTopSpenders] = useState([]);
  const [topPoints, setTopPoints] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);

  const {
    data: customers,
    isLoading: customersLoading,
    error: customersError,
  } = useGetCustomers();

 // console.log(topSpenders, "topSpenders");
//  console.log(topPoints, "topPoints");

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (customers) {
        // debugger;
        const customerOrders = await Promise.all(
          customers.map(async (customer) => {
            const orders = await getOrdersByCustomerId(customer._id);
            // debugger;
            const totalSpent = orders.reduce(
              (sum, order) => sum + order.total,
              0
            );
            return { ...customer, totalSpent, orderCount: orders.length };
          })
        );

        // Sort by total spent
        const sortedBySpent = [...customerOrders]
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 3);
        setTopSpenders(sortedBySpent);

        // Sort by points
        const sortedByPoints = [...customerOrders]
          .sort((a, b) => b.points - a.points)
          .slice(0, 3);
        setTopPoints(sortedByPoints);
      }
    };

    fetchAllOrders();
  }, [customers]);

  if (customersLoading) return <Text>Loading...</Text>;
  if (customersError)
    return <Text>Error fetching data: {customersError.message}</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text className="mt-2 mb-4 p-4 bg-white rounded-md w-full font-bold ">
        {" "}
        <Text className="text-sm">Tổng số lượng khách hàng:</Text>
        <Text className="text-base text-[#ccac00] ml-3 ">
          {customers.length} Thượng đế
        </Text>
      </Text>
      {renderTable(
        topSpenders,
        "Danh sách 3 khách hàng có số tiền đơn hàng tổng cao nhất",
        (item) => item._id,
        ({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <Text>TOP {index + 1}</Text>
            <Text
              onPress={() =>
                navigation.navigate("CustomerDetail", { customerId: item._id })
              }
              className="uppercase underline font-semibold"
            >
              {item.name}
            </Text>
            <Text>
              {item.totalSpent.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        )
      )}
      {renderTable(
        topPoints,
        "Bảng điểm top 3 khách hàng VIP có điểm tích lũy cao nhất",
        (item) => item._id,
        ({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <Text>TOP {index + 1}</Text>

            <Text
              onPress={() =>
                navigation.navigate("CustomerDetail", { customerId: item._id })
              }
              className="uppercase underline font-semibold"
            >
              {item.name}
            </Text>
            <Text>{item.points} Điểm</Text>
          </View>
        )
      )}
    </View>
  );
};

export default VIPCustomerStats;
