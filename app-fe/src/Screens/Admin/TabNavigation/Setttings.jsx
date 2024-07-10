import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
// import { View } from "react-native";
import { useRoleStore } from "../../../Zustand/Role";
import { deleteAutoToken, getToken } from "../../../Utils/http";
import { showSuccessMessage } from "../../../Utils/notifications";
import { StyleSheet, Text, View, Image } from "react-native";
import { jwtDecode } from "jwt-decode";
import { useGetMyProfile, useGetStaffById } from "../../../API/staffApi";
import { useNavigation } from "@react-navigation/native";

export default function Setttings() {
  const { setIsSignedIn } = useRoleStore();
  const [userId, setuserId] = useState("");
  // const { data: staff, isLoading, error } = useGetStaffById(userId);
  const { data: staff, isLoading, error } = useGetMyProfile();
  const navigation = useNavigation();

  console.log("staff", staff);

  const logOut = () => {
    setIsSignedIn(false);
    deleteAutoToken();
    showSuccessMessage("Log Out Successfully!");
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken(); // Assuming getToken is a function to get token from AsyncStorage
        if (token) {
          const decodeToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          if (currentTime < decodeToken.exp) {
            // Assuming 'user_id' is the key in JWT payload containing user ID
            // Extract user ID from token and do something with it if needed
            const userId = decodeToken.user_id;
            setuserId(userId); // Set user ID to state (if needed
            // console.log("User ID from token:", userId);
          }
        }
      } catch (error) {
        console.log("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  return (
    <View>
      {staff && (
        <View style={styles.container}>
          <View style={styles.header} className="rounded-ss">
            <View style={styles.headerContent}>
              <Image
                style={styles.avatar}
                source={{
                  uri: "https://bootdey.com/img/Content/avatar/avatar6.png",
                }}
              />
              <Text style={styles.name}>{staff.name}</Text>
              <Text style={styles.userInfo}>{staff.email}</Text>
              <Text className="uppercase mt-3 font-bold tẽtx-lg">
                {staff.role === 0 ? "Quản lý" : "Nhân viên"}{" "}
              </Text>
            </View>
          </View>

          <View style={styles.body}>
            <TouchableOpacity
              className="w-[90%] mb-2 mt-5 py-3 bg-white flex-row justify-center items-center rounded-lg shadow-md"
              onPress={() => navigation.navigate("MyInformation")}
            >
              <Text className="text-xl font-semibold text-[#937C00]">
                Thông tin của tôi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[90%] mb-2 mt-5 py-3 bg-white flex-row justify-center items-center rounded-lg shadow-md"
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <Text className="text-xl font-semibold text-[#937C00]">
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[90%] mb-3 mt-5 py-3 bg-[#8B0000] flex-row justify-center items-center rounded-lg shadow-md"
              onPress={logOut}
            >
              <Text className="text-xl font-semibold text-white">
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff",
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 8,
    borderColor: "#ccac0073",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "600",
  },
  userInfo: {
    fontSize: 16,
    color: "#778899",
    fontWeight: "600",
  },
  body: {
    backgroundColor: "#ccac0073",
    height: 500,
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  infoContent: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 5,
  },
  iconContent: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: "#FFFFFF",
  },
});
