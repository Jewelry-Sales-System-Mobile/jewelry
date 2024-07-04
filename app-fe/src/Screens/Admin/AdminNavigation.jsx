import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CustomTabIcon from "../../components/Navigation";
import ManageProduct from "./ManageProduct";
import ManageStaff from "./ManageStaff";
import ManageOrder from "./ManageOrder";
import AccountSetting from "../AccountSetting";
import SwitchRole from "../../components/SwitchRole";

const Tab = createBottomTabNavigator();

export default function AdminNavigation({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Favourite") {
            iconName = focused ? "heart" : "heart-outline";
            return <CustomTabIcon name={iconName} color={color} size={20} />;
          } else if (route.name === "Auth") {
            iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={20} color={color} />;
          }
          // Default case
          iconName = focused ? "home" : "home-outline";
          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarActiveBackgroundColor: "white",
      })}
    >
      <Tab.Screen
        name="Order"
        component={ManageOrder}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Staff"
        component={ManageStaff}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Product"
        component={ManageProduct}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Setting"
        component={AccountSetting}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Switch Role"
        component={SwitchRole}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
