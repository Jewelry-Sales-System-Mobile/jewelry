// RevenueChart.js
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useGetAllOrders } from "../../../API/orderApi";
import { format, startOfWeek } from "date-fns";
import { useNavigation } from "@react-navigation/native";

const RevenueChart = () => {
  const navigation = useNavigation();

  const [weeklyData, setWeeklyData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  // console.log("weeklyData", weeklyData);

  const { orders: allOrders, isLoading, error } = useGetAllOrders();
  //  console.log("allOrders", allOrders);

  useEffect(() => {
    if (allOrders && allOrders.length > 0) {
      const weeklyRevenueData = calculateWeeklyRevenue(allOrders);
      setWeeklyData(weeklyRevenueData);

      // Calculate the total revenue from all orders
      const total = allOrders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );
      setTotalRevenue(total);
      setTotalOrder(allOrders.length);
    }
  }, [allOrders]);

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "0";
    const numValue = Number(value); // Convert value to a number
    return numValue.toFixed(2); // Format to 2 decimal places
  };

  const formatCurrencyVND = (value) => {
    if (value == null || isNaN(value)) return "0 VND";
    const numValue = Number(value); // Convert value to a number
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numValue.toFixed(2));
  };

  // Function to calculate weekly revenue
  const calculateWeeklyRevenue = (orders) => {
    const daysOfWeek = [...Array(7)].map((_, index) =>
      startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    // Initialize weekly revenue object
    const weeklyRevenue = daysOfWeek.reduce((acc, day) => {
      const formattedDay = format(day, "yyyy-MM-dd");
      acc[formattedDay] = 0;
      return acc;
    }, {});

    // Calculate total revenue for each day
    orders.forEach((order) => {
      const formattedPrice = formatCurrency(order.total);
      const orderDate = new Date(order.updated_at);
      const formattedOrderDate = format(orderDate, "yyyy-MM-dd");

      // Check if order.total is not null and is a number
      if (order.total != null && !isNaN(order.total)) {
        // Round the total to 2 decimal places
        const roundedTotal = parseFloat(order.total.toFixed(2));

        // Add to weeklyRevenue for the formattedOrderDate
        if (!weeklyRevenue[formattedOrderDate]) {
          weeklyRevenue[formattedOrderDate] = roundedTotal;
        } else {
          weeklyRevenue[formattedOrderDate] += roundedTotal;
        }
      }
    });

    // Convert data to fit chart format and sort by date
    const weeklyRevenueData = Object.keys(weeklyRevenue)
      .map((date) => ({
        date,
        revenue: weeklyRevenue[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return weeklyRevenueData;
  };

  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0, // Remove decimals from y-axis
    propsForLabels: {
      fontSize: 10, // Set the font size for labels
    },
    yAxisLabel: "",
    yAxisSuffix: " VND",
    formatYLabel: (value) =>
      parseInt(value).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
  };

  // Handle loading state
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Handle error state
  if (error) {
    return <Text>Error fetching data: {error.message}</Text>;
  }

  const weeklyRevenueData = calculateWeeklyRevenue(allOrders).filter(
    (data) => !isNaN(data.revenue)
  );

  // console.log("weeklyRevenueData", weeklyRevenueData);
  // console.log("chartConfig", chartConfig);

  // Calculate total revenue for the week
  const totalWeeklyRevenue = weeklyData.reduce(
    (sum, data) => sum + data.revenue,
    0
  );

  const listOrder = () => {
    navigation.navigate("Order"); // Navigate to CustomerDetail screen
  };

  return (
    <View className="w-[90%]">
      {totalRevenue && totalOrder && (
        <View className="my-2 p-4 bg-white rounded-md w-full font-bold ">
          <View className="  flex-row items-center">
            <Text className="text-sm font-bold">Tổng doanh thu :</Text>
            <Text
              className="text-base text-[#ccac00] ml-3 font-bold "
              onPress={() => navigation.navigate("CustomerAccount")}
            >
              {formatCurrencyVND(totalRevenue)} / {totalOrder} đơn
            </Text>
          </View>
          <Text
            className="text-sm underline font-medium mrs-4 text-right"
            onPress={listOrder}
          >
            Tất cả
          </Text>
        </View>
      )}
      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Doanh thu tổng quan theo tuần
        </Text>
        {weeklyData.length !== 0 && (
          <LineChart
            data={{
              labels: weeklyData.map((data) =>
                format(new Date(data.date), "dd/MM/yyyy")
              ),
              datasets: [
                {
                  data: weeklyData.map((data) => data.revenue),
                  color: (opacity = 1) => `rgba(204, 172, 0, ${opacity})`, // optional
                  strokeWidth: 2, // optional
                },
              ],
              legend: ["Doanh thu ngày"], // optional
            }}
            width={screenWidth - 30}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        )}
      </View>

      {totalWeeklyRevenue && (
        <View className=" flex-row ">
          <Text className="font-semibold text-sm mr-2">
            Tổng doanh thu trong 1 tuần:
          </Text>
          <Text className="text-[#937C00] ml-2 font-semibold">
            {formatCurrencyVND(totalWeeklyRevenue)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RevenueChart;
