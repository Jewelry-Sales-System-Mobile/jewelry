import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Menu, Provider, Button, Portal, Text } from "react-native-paper";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

const ActionDropdown = ({
  item,
  handleUpdateProduct,
  setModalVisible,
  setSelectedProduct,
  handleDeleteProductImage,
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Provider>
      <Portal>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={{ x: 0, y: 32 }} // Điều chỉnh vị trí của anchor nếu cần thiết
          style={styles.menu}
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              handleUpdateProduct(item);
            }}
            title={
              <TouchableOpacity className="flex-row justify-around items-center">
                <MaterialIcons name="edit" size={20} color="gray" />
                <Text className="text-gray mx-3 text-sm"> Chỉnh sửa</Text>
              </TouchableOpacity>
            }
            icon="pencil"
            style={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              setSelectedProduct(item);
              setModalVisible(true);
            }}
            title={
              <TouchableOpacity className="flex-row justify-around items-center">
                <Feather name="eye" size={20} color="#998100" />
                <Text className="text-[#998100] mx-3 text-sm">Xem</Text>
              </TouchableOpacity>
            }
            icon="eye"
            style={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              setSelectedProduct(item);
              handleDeleteProductImage(item);
            }}
            title={
              <TouchableOpacity className="flex-row justify-around items-center">
                <FontAwesome name="trash" size={20} color="#8B0000" />
                <Text className="text-[#8B0000] mx-3 text-sm">Xóa ảnh</Text>
              </TouchableOpacity>
            }
            icon="delete"
            style={styles.menuItem}
          />
        </Menu>
      </Portal>
      <View style={styles.anchorView}>
        <Button onPress={openMenu}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </Button>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  anchorView: {
    position: "relative",
    zIndex: 1, // Đảm bảo anchor view có zIndex cao hơn nếu cần thiết
  },
  menu: {
    position: "absolute",
    top: 32,
    left: -99,
    // width: 150,
    zIndex: 2, // Đặt zIndex cao hơn để đảm bảo menu hiển thị trên cùng
  },
  //   menuItem: {
  //     right: 32,
  //   },
});

export default ActionDropdown;
