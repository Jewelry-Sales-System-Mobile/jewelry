// OrderManagementStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OrderManagementScreen from "../TabNavigation/OrderManage";
import { Text } from "react-native-paper";

const Stack = createStackNavigator();

const OrderManagementStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderManagement"
        component={OrderManagementScreen}
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Quản lý đơn hàng
            </Text>
          ),
        }}
      />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default OrderManagementStackNavigator;
