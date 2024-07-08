import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
// import CustomTabIcon from "../../components/Navigation";
import SignIn from "../Screens/Guest/SignIn";
import SignUp from "../Screens/Guest/SignUp";
import Welcome from "../Screens/Guest/Welcome";
import SwitchRole from "../components/SwitchRole";
import CustomTabIconV2 from "./CustomIconTabV2";
import ProductManagementScreen from "../Screens/Guest/TabNavigation/ProductManage";
import DashboardScreen from "../Screens/Guest/TabNavigation/DashBoard";
import OrderManagementScreen from "../Screens/Guest/TabNavigation/OrderManage";
import CustomerManagementScreen from "../Screens/Guest/TabNavigation/CustomerManage";
import EmployeeManagementScreen from "../Screens/Guest/TabNavigation/EmployeeManage";
import CounterManagementScreen from "../Screens/Guest/TabNavigation/CounterManage";
import CounterStackNavigator from "./stack-navigators/CounterStackNavigator";

const Tab = createBottomTabNavigator();

export default function GuestNavigation({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconUri;
          if (route.name === "Customer") {
            iconUri =
              "https://img.icons8.com/small/64/null/gender-neutral-user.png";
          } else if (route.name === "Product") {
            iconUri = "https://img.icons8.com/small/64/null/gear.png";
          } else if (route.name === "Order") {
            iconUri = "https://cdn-icons-png.flaticon.com/512/2977/2977924.png";
          } else if (route.name === "Quầy hàng") {
            iconUri = "https://img.icons8.com/small/64/null/switch.png";
          } else {
            // Default case
            iconUri = "https://img.icons8.com/small/64/null/home-page.png";
          }
          return <CustomTabIconV2 uri={iconUri} isFocused={focused} />;
        },
        tabBarActiveTintColor: "tomato",
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
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Customer"
        component={CustomerManagementScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Product"
        component={ProductManagementScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Order"
        component={OrderManagementScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Quầy hàng"
        component={CounterStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
