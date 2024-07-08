import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import {
  useActivateStaff,
  useGetAllStaff,
  useInactivateStaff,
  useRegisterStaff,
} from "../../../API/staffApi";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Modal, Searchbar, Title } from "react-native-paper";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

const ManageStaff = () => {
  const { data: staff, isLoading, error } = useGetAllStaff();
  const navigation = useNavigation(); // Initialize useNavigation hook
  const { mutate: activateStaffMutation } = useActivateStaff();
  const { mutate: inactivateStaffMutation } = useInactivateStaff();

  const [searchQuery, setSearchQuery] = useState("");

  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    name: "",
  });

  const { mutate: registerStaffMutation } = useRegisterStaff();

  console.log("staffs", staff);
  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredStaff = staff?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModalAdd = () => setModalVisibleAdd(true);
  const closeModalAdd = () => setModalVisibleAdd(false);

  const handleChange = (field, value) => {
    setNewStaffData({
      ...newStaffData,
      [field]: value,
    });
  };

  const handleCreateStaff = async () => {
    try {
      await registerStaffMutation(newStaffData);
      closeModalAdd();
    } catch (error) {
      console.error("Error creating staff:", error);
      // Handle error display or logging
    }
  };
  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.staffCard} className="shadow-md">
      <View className="flex-row ">
        <Text className="font-semibold mr-4">#{index + 1}</Text>
        <View className="w-[90%]">
          <View className="flex-row justify-between">
            <Text style={styles.staffName}>{item.name}</Text>
            <Text className="text-[#937C00] font-semibold">{item.email}</Text>
          </View>
          <Text className="text-xs text-gray mb-2">
            {moment(item.created_at).format("DD/MM/YYYY, hh:mm A")}
          </Text>
          <Text className=" font-semibold mb-2">
            Vị trí: {item.role === 0 ? "Quản lý" : "Nhân viên"}
          </Text>
          <Text className=" mb-4 ">
            Quầy hàng quản lý: {item?.assigned_counter}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between  items-center mx-2">
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleToggle(item)}
          className="w-[30%]"
        >
          <FontAwesome
            name={item.verify === 1 ? "toggle-on" : "toggle-off"}
            size={20}
            color={item.verify === 1 ? "green" : "gray"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewDetailButton}
          className="w-[50%]"
          onPress={() =>
            navigation.navigate("StaffDetail", { staffId: item._id })
          }
        >
          <Text style={styles.viewDetailButtonText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleToggle = (item) => {
    if (item.verify === 1) {
      // debugger;
      // Nếu đang bật, vô hiệu hóa
      inactivateStaffMutation(item._id);
    } else {
      // debugger;
      // Nếu đang tắt, kích hoạt
      activateStaffMutation(item._id);
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Có lỗi xảy ra khi tải dữ liệu nhân viên.</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer} className="items-center">
        <Searchbar
          placeholder="Tìm tên hoặc email nhân viên..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          // className="shadow-md"
        />
        <TouchableOpacity
          className="flex-row ml-4 bg-[#ccac00] items-center self-center rounded-md p-2 "
          onPress={openModalAdd}
        >
          <FontAwesome name="plus" size={20} color="white" />
          {/* <Text style={{ color: "white", marginLeft: 10 }}>Tạo Sản Phẩm</Text> */}
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredStaff}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for adding new staff */}
      <Modal visible={modalVisibleAdd} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title className="font-semibold text-xl mb-5 text-[#ccac00]">
              Tạo Account Mới
            </Title>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newStaffData.email}
              onChangeText={(text) => handleChange("email", text)}
              autoCapitalize="none"
              mode="outlined"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={newStaffData.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={newStaffData.confirm_password}
              onChangeText={(text) => handleChange("confirm_password", text)}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newStaffData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
            <TouchableOpacity
              style={styles.addButton2}
              onPress={handleCreateStaff}
              // disabled={!isFormValidAdd()}
            >
              <Text style={styles.buttonText}>Tạo Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeModalAdd}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer2: {
    flexDirection: "row",
    zIndex: 2,
    alignItems: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "between",
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    width: "90%",
  },
  listContainer: {
    paddingBottom: 20,
  },
  staffCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  viewDetailButton: {
    backgroundColor: "#ccac00",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  viewDetailButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  addButton2: {
    backgroundColor: "#ccac00",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
});

export default ManageStaff;
