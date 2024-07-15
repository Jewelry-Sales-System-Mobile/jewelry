// OrderManagementStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native-paper";
import ProductManagementScreenStaff from "../TabNavigation/ProductManage";

const Stack = createStackNavigator();

const ProductManagementStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductManagement"
        component={ProductManagementScreenStaff}
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Quản lý sản phẩm Trang Sức
            </Text>
          ),
        }}
      />

      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};

export default ProductManagementStackNavigator;
