import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountManagementScreen from "../TabNavigation/AccountManage";
import ManageCustomer from "./CustomerAccountScreen";
import ManageStaff from "./StaffAccountScreen";
import CustomerDetailScreen from "../DetailScreen/CustomerDetailScreen";
import StaffDetailScreen from "../DetailScreen/StaffDetailScreen";
import CounterDetails from "../Counter/CounterDetails";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Stack = createNativeStackNavigator();

export default function AccountManagementStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountManagement"
        component={AccountManagementScreen}
        options={({ navigation }) => ({
          headerTitleAlign: "center",
          headerShown: true,
          headerTitle: () => (
            <Text className="text-xl font-medium">Quản lý người dùng</Text>
          ),
        })}
      />
      <Stack.Screen
        name="StaffAccount"
        component={ManageStaff}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Quản lý Nhân Viên",
          headerLeft: () => (
            // Sử dụng headerLeft để đặt nút back
            <TouchableOpacity
              onPress={() => navigation.navigate("AccountManagement")}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={20}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
          tabBarVisible: false, // Ẩn bottom navigation bar khi vào CustomerDetail
        })}
      />
      <Stack.Screen
        name="CustomerAccount"
        component={ManageCustomer}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Quản lý Khách Hàng",
          headerLeft: () => (
            // Sử dụng headerLeft để đặt nút back
            <TouchableOpacity
              onPress={() => navigation.navigate("AccountManagement")}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={20}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
          tabBarVisible: false, // Ẩn bottom navigation bar khi vào CustomerDetail
        })}
      />
    </Stack.Navigator>
  );
}
