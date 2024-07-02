import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CustomTabIcon from "src/components/Navigation";
import ManageTask from "./ManageTask";
import ManageProduct from "./ManageProduct";
import AccountSetting from "../AccountSetting";

const Tab = createBottomTabNavigator();

export default function StaffNavigation({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Default case
          iconName = focused ? "home" : "home-outline";
          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="ManageProduct"
        component={ManageProduct}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ManageTask"
        component={ManageTask}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Setting"
        component={AccountSetting}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
