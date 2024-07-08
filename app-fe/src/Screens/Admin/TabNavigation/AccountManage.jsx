import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

const AccountManagementScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("StaffAccount")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/256/10857/10857085.png",
            }} // Đường dẫn đến hình ảnh Nhân Viên
            style={styles.image}
          />
          <Text style={styles.menuText}>Quản lý Nhân Viên</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("CustomerAccount")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3225/3225084.png",
            }} // Đường dẫn đến hình ảnh Khách Hàng
            style={styles.image}
          />
          <Text style={styles.menuText}>Quản lý Khách Hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccac0073",
  },
  menuItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#937C00",
  },
});

export default AccountManagementScreen;
