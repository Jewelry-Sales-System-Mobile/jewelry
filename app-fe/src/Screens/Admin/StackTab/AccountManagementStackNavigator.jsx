import React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountManagementScreen from "../TabNavigation/AccountManage";
import ManageCustomer from "./CustomerAccountScreen";
import ManageStaff from "./StaffAccountScreen";
import CustomerDetailScreen from "../DetailScreen/CustomerDetailScreen";
import StaffDetailScreen from "../DetailScreen/StaffDetailScreen";
import CounterDetails from "../Counter/CounterDetails";

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
        options={{
          headerShown: true,
          headerTitle: "Quản lý Nhân Viên",
        }}
      />
      <Stack.Screen
        name="CustomerAccount"
        component={ManageCustomer}
        options={{
          headerShown: true,
          headerTitle: "Quản lý Khách Hàng",
        }}
      />
      {/* <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{
          headerShown: true,
          headerTitle: "Thông tin chi tiết Khách Hàng",
        }}
      /> */}
      {/* <Stack.Screen
        name="StaffDetail"
        component={StaffDetailScreen}
        options={{
          headerShown: true,
          headerTitle: "Thông tin chi tiết Nhân Viên",
        }}
      /> */}
      <Stack.Screen
        name="Chi tiết quầy hàng"
        component={CounterDetails}
        options={{
          headerShown: true,
          headerTitle: "Chi tiết quầy hàng",
        }}
      />
    </Stack.Navigator>
  );
}
