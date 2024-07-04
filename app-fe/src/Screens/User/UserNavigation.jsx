import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CustomTabIcon from "../../components/Navigation";
import Product from "../Product";
import Favourite from "./Favourite";
import ManageCart from "./ManageCart";
import AccountSetting from "../AccountSetting";
import SwitchRole from "../../components/SwitchRole";

const Tab = createBottomTabNavigator();

export default function UserNavigation({ navigation }) {
  const favorites = []; // Dummy favorites array for demonstration

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Favourite") {
            iconName = focused ? "heart" : "heart-outline";
            return (
              <CustomTabIcon
                name={iconName}
                color={color}
                size={20}
                favorites={favorites}
              />
            );
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
      })}
    >
      <Tab.Screen
        name="Product"
        component={Product}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favourite"
        component={Favourite}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ManageCart"
        component={ManageCart}
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
