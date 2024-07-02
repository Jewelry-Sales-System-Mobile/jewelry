import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CustomTabIcon from "src/components/Navigation";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Welcome from "./Welcome";

const Tab = createBottomTabNavigator();

export default function GuestNavigation({ navigation }) {
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
      })}
    >
      <Tab.Screen
        name="Product"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Sign In"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Sign Up"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
