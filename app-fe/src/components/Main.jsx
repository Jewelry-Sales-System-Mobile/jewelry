import { NativeWindStyleSheet } from "nativewind";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import StaffNavigation from "../Screens/Staff/StaffNavigation";
import UserNavigation from "../Screens/User/UserNavigation";
import { useGetProducts } from "../API/test";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminNavigation from "../Screens/Admin/AdminNavigation";
import GuestNavigation from "../Screens/Guest/GuestNavigation";
import { useRoleStore } from "../Zustand/Role";

const Stack = createNativeStackNavigator();
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Main() {
  // const [isSignedIn, setIsSignedIn] = useState(true);
  // const [role, setRole] = useState(0); // 0: admin, 1: staff , 2: user
  const { role, isSignedIn, token, setRole, setIsSignedIn, setToken } =
    useRoleStore();
  const { data: products, isLoading, error } = useGetProducts();
  console.log(products, "products");

  useEffect(() => {
    async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        setToken(token ? token : null);
      } catch (error) {
        console.log(error, "error");
      }
    };
  }, []);

  console.log("token", token); // This will log the token value
  return (
    <View
      className=" w-full h-full  bg-white"
      style={{ backgroundColor: "white" }}
    >
      {/* <View className="flex flex-row ">
        <Text
          onPress={() => setRole(0)}
          className="w-1/4 cursor-pointer text-blue-500"
        >
          User
        </Text>
        <Text
          onPress={() => setRole(1)}
          className="w-1/4 cursor-pointer text-yellow-500"
        >
          Staff
        </Text>
        <Text
          onPress={() => setRole(2)}
          className="w-1/4 cursor-pointer text-red-500"
        >
          Admin
        </Text>
        <Text
          onPress={() => setIsSignedIn(!isSignedIn)}
          className="w-1/4 cursor-pointer text-green-500"
        >
          Sign In
        </Text>
        <Text onPress={() => setToken("123456")} className="cursor-pointer">
          Set {token} Token
        </Text>
      </View> */}
      <NavigationContainer>
        <View className="w-full h-full">
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
              (() => {
                switch (role) {
                  case 0:
                    return (
                      <Stack.Screen
                        name="UserNavigate"
                        component={UserNavigation}
                      />
                    );
                  case 1:
                    return (
                      <Stack.Screen
                        name="StaffNavigate"
                        component={StaffNavigation}
                      />
                    );
                  case 2:
                    return (
                      <Stack.Screen
                        name="AdminNavigate"
                        component={AdminNavigation}
                      />
                    );
                  default:
                    return null;
                }
              })()
            ) : (
              <Stack.Screen name="Guest" component={GuestNavigation} />
            )}
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </View>
  );
}
