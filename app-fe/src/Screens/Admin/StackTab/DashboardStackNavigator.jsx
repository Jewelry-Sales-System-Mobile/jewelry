// DashboardStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity } from "react-native";
import CustomerDetailScreen from "../DetailScreen/CustomerDetailScreen";
import DashboardScreen from "../TabNavigation/DashBoard";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Stack = createStackNavigator();

const DashboardStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          headerTitle: () => (
            <Text style={{ fontSize: 18, fontWeight: "700" }}>QUẢN LÝ</Text>
          ),
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Thông tin chi tiết Khách Hàng",
          headerLeft: () => (
            // Sử dụng headerLeft để đặt nút back
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={20}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
          tabBarVisible: false, // Ẩn bottom navigation bar khi vào CustomerDetail
        })}
      />
    </Stack.Navigator>
  );
};

export default DashboardStackNavigator;
