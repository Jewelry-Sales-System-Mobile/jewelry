// DashboardStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity, View } from "react-native";
import CustomerDetailScreen from "../DetailScreen/CustomerDetailScreen";
import DashboardScreen from "../TabNavigation/DashBoard";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ManageCustomer from "./CustomerAccountScreen";
import OrderManagementScreenAdmin from "../TabNavigation/OrderManage";
import { useGetMyProfile } from "../../../API/staffApi";

const Stack = createStackNavigator();

const DashboardStackNavigator = () => {
  const { data: info, isLoading, error } = useGetMyProfile();
  console.log("info", info);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={DashboardScreen}
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          headerTitle: () => (
            <View>
              {info && info?.role === 0 ? (
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  DASHBOARD QUẢN LÝ
                </Text>
              ) : (
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  DASHBOARD NHÂN VIÊN
                </Text>
              )}
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="CustomerAccount"
        component={ManageCustomer}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Quản lý Khách Hàng",
          headerLeft: () => (
            // Sử dụng headerLeft để đặt nút back
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={20}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
          tabBarVisible: false, // Ẩn bottom navigation bar khi vào CustomerDetail
        })}
        // options={{
        //   headerShown: true,
        //   headerTitle: "Quản lý Khách Hàng",
        // }}
      />
      {/* <Stack.Screen
        name="OrderManagement"
        component={OrderManagementScreen}
        options={{
          headerShown: true,
          headerTitle: "Quản lý Đơn Hàng",
        }}
      /> */}
    </Stack.Navigator>
  );
};

export default DashboardStackNavigator;
