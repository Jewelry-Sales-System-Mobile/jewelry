import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageCounter from '../../Screens/Admin/Counter/ManageCounter';
import CounterDetails from '../../Screens/Admin/Counter/CounterDetails';
import AssignEmployee from '../../Screens/Admin/Counter/AssignEmployee';
import UpdateCounter from '../../Screens/Admin/Counter/UpdateCounter';

const Stack = createNativeStackNavigator();

export default function CounterStackNavigator() {
  return (
    <Stack.Navigator
    // screenOptions={{
    //   headerShown: false,
    // }}
  >
    <Stack.Screen name="Counter" component={ManageCounter} options={({ navigation }) => ({
      headerTitleAlign: "center",
        headerShown: true,
        headerTitle: () => <Text className="text-lg font-medium">Quản lý quầy hàng</Text>
      })}/>
    <Stack.Screen
      name="Chi tiết quầy hàng"
      component={CounterDetails}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Cập nhật thông tin quầy hàng"
      component={UpdateCounter}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="Phân công nhân viên"
      component={AssignEmployee}
      options={{
        headerShown: true,
      }}
    />
  </Stack.Navigator>
  )
}