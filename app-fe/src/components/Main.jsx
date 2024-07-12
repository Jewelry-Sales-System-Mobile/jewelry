import { NativeWindStyleSheet } from "nativewind";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminNavigation from "../Screens/Admin/AdminNavigation";
import GuestNavigation from "../navigation/GuestNavigation";
import SignIn from "../Screens/Auth/SignIn";
import { useRoleStore } from "../Zustand/Role";
import { getToken, deleteAutoToken } from "../Utils/http";
import { jwtDecode } from "jwt-decode"; // Corrected import
import CustomerDetail from "../Screens/Guest/TabNavigation/CustomerDetail";
import CustomerDetailScreen from "../Screens/Admin/DetailScreen/CustomerDetailScreen";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import StaffDetailScreen from "../Screens/Admin/DetailScreen/StaffDetailScreen";
import CounterDetails from "../Screens/Admin/Counter/CounterDetails";
import AssignEmployee from "../Screens/Admin/Counter/AssignEmployee";
import UpdateCounter from "../Screens/Admin/Counter/UpdateCounter";
import CreateCounter from "../Screens/Admin/Counter/CreateCounter";
import OrderSuccess from "./Staff/CustomerManage/OrderSuccess";

const Stack = createNativeStackNavigator();
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Main() {
  const { role, isSignedIn, setRole, setToken, setIsSignedIn } = useRoleStore();

  useEffect(() => {
    (async () => {
      // Fixed IIFE syntax
      try {
        const token = await AsyncStorage.getItem("auth_token");
        setToken(token ? token : "");
      } catch (error) {
        console.log(error, "error");
      }
    })();
  }, []);

  const decodeTokenJwt = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error("Invalid token specified:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("check role", role, isSignedIn);
    const fetchToken = async () => {
      const token = await getToken();
      if (token) {
        const decodeToken = decodeTokenJwt(token); // Corrected variable declaration
        const currentTime = Math.floor(Date.now() / 1000);
        // console.log("check exp", decodeToken);
        // console.log("check exp", decodeToken.exp, currentTime);
        if (currentTime < decodeToken.exp) {
          // Corrected property access
          // console.log("check role", decodeToken.role, isSignedIn, role);
          setRole(decodeToken.role);
          setIsSignedIn(true); // Corrected method call
        } else {
          // Handle token expiration
          console.log("Token expired");
          setIsSignedIn(false); // Corrected method call
          deleteAutoToken();
        }
      }
      console.log("check token", token);
    };

    fetchToken();
  }, [isSignedIn, role]);
  const renderScreenBasedOnRole = () => {
    switch (role) {
      case 0:
        return (
          <>
            <Stack.Screen name="Admin" component={AdminNavigation} />
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
            <Stack.Screen
              name="StaffDetail"
              component={StaffDetailScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: "Thông tin chi tiết Nhân Viên",
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
            <Stack.Screen
              name="Chi tiết quầy hàng"
              component={CounterDetails}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: "Chi tiết quầy hàng",
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
            <Stack.Screen
              name="Phân công nhân viên"
              component={AssignEmployee}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: "Phân công nhân viên",
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
            <Stack.Screen
              name="Cập nhật thông tin quầy hàng"
              component={UpdateCounter}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: "Cập nhật thông tin quầy hàng",
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

            <Stack.Screen
              name="Tạo quầy hàng mới"
              component={CreateCounter}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: "Tạo quầy hàng mới",
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
          </>
        );
      case 1:
        return (
          <>
            <Stack.Screen name="Staff" component={GuestNavigation} />
            {/* <Stack.Screen name="CustomerDetails" component={CustomerDetail} /> */}
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
            <Stack.Screen
              name="OrderSuccess"
              component={OrderSuccess}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: "Tạo đơn hàng thành công",
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
          </>
        );
      default:
        return (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
          </>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          renderScreenBasedOnRole()
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />

            {/* <Stack.Screen name="Staff" component={GuestNavigation} /> */}
          </>
        )}
      </Stack.Navigator>
    </View>
  );
}
