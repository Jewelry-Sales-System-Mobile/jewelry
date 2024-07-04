import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useRoleStore } from "../Zustand/Role";

export default function SwitchRole() {
  const { role, isSignedIn, token, setRole, setIsSignedIn, setToken } =
    useRoleStore();
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
  return (
    <View className="flex flex-col ">
      <Text
        onPress={() => setRole(0)}
        className="w-1/4 cursor-pointer text-blue-500 m-5 text-xl font-bold    "
      >
        User
      </Text>
      <Text
        onPress={() => setRole(1)}
        className="w-1/4 cursor-pointer text-yellow-500 m-5 text-xl font-bold   "
      >
        Staff
      </Text>
      <Text
        onPress={() => setRole(2)}
        className="w-1/4 cursor-pointer text-red-500 m-5 text-xl font-bold   "
      >
        Admin
      </Text>
      <Text
        onPress={() => setIsSignedIn(!isSignedIn)}
        className="w-1/4 cursor-pointer text-green-500 m-5 text-xl font-bold"
      >
        Sign In
      </Text>
      <Text
        onPress={() => setToken("123456")}
        className="cursor-pointer m-5 text-xl font-bold"
      >
        Set {token} Token
      </Text>
    </View>
  );
}
