import React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Setttings from "../TabNavigation/Setttings";
import ChangePasswordScreen from "./ChangePasswordScreen";
import MyInformationScreen from "./MyInformationScreen";

const Stack = createNativeStackNavigator();

export default function SettingManagementStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Setttings}
        options={({ navigation }) => ({
          headerTitleAlign: "center",
          headerShown: true,
          headerTitle: () => (
            <Text className="text-xl font-medium">Cài đặt </Text>
          ),
        })}
      />
      <Stack.Screen
        name="MyInformation"
        component={MyInformationScreen}
        options={{
          headerShown: true,
          headerTitle: "Thông tin của tôi",
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          headerTitle: "Đổi mật khẩu",
        }}
      />
    </Stack.Navigator>
  );
}
