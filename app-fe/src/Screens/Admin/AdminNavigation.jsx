import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ManageCounter from "./Counter/ManageCounter";
import { Text } from "react-native";
import CustomTabIconV2 from "./CustomIconTabV2";
import ProductManagementScreen from "./TabNavigation/ProductManage";
import DashboardScreen from "./TabNavigation/DashBoard";
import OrderManagementScreen from "./TabNavigation/OrderManage";
import CustomerManagementScreen from "./TabNavigation/CustomerManage";
import AccountManagementScreen from "./TabNavigation/AccountManage";
import CounterManagementScreen from "./TabNavigation/CounterManage";
import CounterStackNavigator from "../../navigation/stack-navigators/CounterStackNavigator";
import Setttings from "./TabNavigation/Setttings";
import AccountManagementStackNavigator from "./StackTab/AccountManagementStackNavigator";
import SettingManagementStackNavigator from "./StackTab/SettingManagementStackNavigator";
import DashboardStackNavigator from "./StackTab/DashboardStackNavigator";
import OrderManagementStackNavigator from "./StackTab/OrderManagementStackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function AdminNavigation() {
  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconUri;
          if (route.name === "Setting") {
            iconUri =
              "https://www.iconpacks.net/icons/2/free-settings-icon-3110-thumb.png";
          } else if (route.name === "Product") {
            iconUri = "https://img.icons8.com/small/64/null/gear.png";
          } else if (route.name === "Account") {
            iconUri = "https://static.thenounproject.com/png/4181324-200.png";
          } else if (route.name === "Order") {
            iconUri = "https://cdn-icons-png.flaticon.com/512/2977/2977924.png";
          } else if (route.name === "Quầy hàng") {
            iconUri = "https://img.icons8.com/small/64/null/switch.png";
          } 
          else {
            // Default case
            iconUri = "https://img.icons8.com/small/64/null/home-page.png";
          }
          return <CustomTabIconV2 uri={iconUri} isFocused={focused} />;
        },
        tabBarActiveTintColor: "#ccac00",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 75, // Đổi chiều cao thành 70px
          // backgroundColor: "transparent", // Đảm bảo background trong suốt
          borderTopWidth: 0, // Loại bỏ đường viền phía trên
          elevation: 0, // Loại bỏ đổ bóng
        },
        tabBarLabelStyle: {
          marginBottom: 10, // Thêm margin bottom 10px cho tabBarLabel
          fontWeight: 600, // Đổi font chữ sang bold
          fontSize: 12, // Đổi kích cỡ chữ thành 12px
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={AccountManagementStackNavigator}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Product"
        component={ProductManagementScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Order"
        component={OrderManagementStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Quầy hàng"
        component={CounterStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingManagementStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
