import { NativeWindStyleSheet } from "nativewind";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import StaffNavigation from "../Screens/Staff/StaffNavigation";
import UserNavigation from "../Screens/User/UserNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminNavigation from "../Screens/Admin/AdminNavigation";
import GuestNavigation from "../Screens/Guest/GuestNavigation";
import { useRoleStore } from "../Zustand/Role";
import axios from "axios";
import SignIn from "../Screens/Guest/SignIn";
import { getToken } from "../Utils/http";
import { jwtDecode } from "jwt-decode";

const Stack = createNativeStackNavigator();
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Main() {
  // const [isSignedIn, setIsSignedIn] = useState(true);
  // const [role, setRole] = useState(0); // 0: admin, 1: staff , 2: user
  const { role, isSignedIn, setRole, setIsSignedIn, setToken } = useRoleStore();
  // const { data: products, isLoading, error } = useGetProducts();
  // console.log(products, "products");

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

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      if (token) {
        decodeToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        console.log("check exp", decodeToken.exp, currentTime);
        if (currentTime < token.exp) {
          setRole(decodeToken.role);
        } else {
          window.location.href = "/";
          // Cookies.remove("auth_token");
          // logout();
        }
      }
    };

    fetchToken();
  }, [getToken()]);
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
              // Screens to show when the user is signed in
              <>
                <Stack.Screen name="Guest" component={GuestNavigation} />
                {/* Add more screens for signed in users here */}
              </>
            ) : (
              // Screens to show when the user is not signed in
              <>
                <Stack.Screen name="SignIn" component={SignIn} />
                {/* <Stack.Screen name="Guest" component={GuestNavigation} /> */}

                {/* Add more screens for not signed in users here */}
              </>
            )}
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </View>
  );
}
