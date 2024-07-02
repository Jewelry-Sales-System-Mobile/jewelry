import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CustomTabIcon from "src/components/Navigation";
import Favourite from "./User/Favourite";

const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {
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
        name="Favourite"
        component={Favourite}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
