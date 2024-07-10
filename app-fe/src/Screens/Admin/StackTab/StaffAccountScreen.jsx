import React, { useEffect, useState } from "react";
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
import { jwtDecode } from "jwt-decode";
import { getToken } from "../../../Utils/http";
import { showMessage } from "react-native-flash-message";
import { useGetCounterById } from "../../../API/counter";

const MAX_NAME_LENGTH = 70;
const MIN_PASSWORD_LENGTH = 8;

const ManageStaff = () => {
  const { data: staff, isLoading, error } = useGetAllStaff();

  const navigation = useNavigation(); // Initialize useNavigation hook
  const { mutate: activateStaffMutation } = useActivateStaff();
  const { mutate: inactivateStaffMutation } = useInactivateStaff();
  const [visibleStaffs, setVisibleStaffs] = useState(3); // Số sản phẩm hiển thị ban đầu

  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setuserId] = useState("");

  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    name: "",
  });

  const { mutate: registerStaffMutation } = useRegisterStaff();

  const [errors, setErrors] = useState({
    email: null,
    password: null,
    confirm_password: null,
    name: null,
  });

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

  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredStaff = staff?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModalAdd = () => setModalVisibleAdd(true);
  const closeModalAdd = () => {
    setModalVisibleAdd(false);
    // Đặt lại thông tin và lỗi về trạng thái ban đầu khi đóng modal
    setNewStaffData({
      email: "",
      password: "",
      confirm_password: "",
      name: "",
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setNewStaffData({
      ...newStaffData,
      [field]: value,
    });

    // Xác thực dữ liệu khi người dùng nhập
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let errorMsg = "";

    switch (field) {
      case "email":
        if (!value) {
          errorMsg = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Email không hợp lệ.";
        }
        break;

      case "password":
        if (!value) {
          errorMsg = "Password không được để trống.";
        } else if (value.length < MIN_PASSWORD_LENGTH) {
          errorMsg = `Password phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;
        } else if (!/[A-Z]/.test(value)) {
          errorMsg = "Password phải có ít nhất một chữ hoa.";
        } else if (!/[a-z]/.test(value)) {
          errorMsg = "Password phải có ít nhất một chữ thường.";
        } else if (!/[0-9]/.test(value)) {
          errorMsg = "Password phải có ít nhất một chữ số.";
        } else if (!/[\$#@+\-=?!\.]/.test(value)) {
          errorMsg =
            "Password phải có ít nhất 1 ký tự đặc biệt ($,#,@,+,-,=,?,!).";
        }
        break;

      case "confirm_password":
        if (value !== newStaffData.password) {
          errorMsg = "Password xác nhận không khớp.";
        }
        break;

      case "name":
        if (!value) {
          errorMsg = "Tên không được để trống.";
        } else if (value.length > MAX_NAME_LENGTH) {
          errorMsg = `Tên không được quá ${MAX_NAME_LENGTH} ký tự.`;
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMsg,
    }));
  };

  const isFormValidAdd = () => {
    return (
      !errors.email &&
      !errors.password &&
      !errors.confirm_password &&
      !errors.name &&
      newStaffData.email &&
      newStaffData.password &&
      newStaffData.confirm_password &&
      newStaffData.name
    );
  };

  const handleCreateStaff = async () => {
    if (!isFormValidAdd()) {
      return;
    }

    try {
      await registerStaffMutation(newStaffData);
      closeModalAdd();
    } catch (error) {
      console.error("Error creating staff:", error);
      // Handle error display or logging
    }
  };

  const handleToggle = async (item) => {
    try {
      const token = await getToken(); // Assuming getToken is a function to get token from AsyncStorage
      if (token) {
        const decodeToken = jwtDecode(token);
        const userId = decodeToken.user_id;
        if (userId === item._id) {
          showMessage({
            message: "Không thể vô hiệu hoá tài khoản hiện tại",
            type: "danger",
            icon: "danger",
          });
          return;
        }
      }

      const mutationFn =
        item.verify === 1 ? inactivateStaffMutation : activateStaffMutation;
      mutationFn(item._id);
    } catch (error) {
      console.error("Error toggling staff:", error);
      // Handle error display or logging
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Có lỗi xảy ra khi tải dữ liệu nhân viên.</Text>;

  const handleLoadMore = () => {
    setVisibleStaffs(visibleStaffs + 3); // Tăng số lượng sản phẩm hiển thị khi nhấn nút "Xem thêm"
  };

  const renderFooter = () => {
    // Kiểm tra nếu không còn sản phẩm để hiển thị thì không hiển thị nút "Xem thêm"
    if (visibleStaffs >= filteredStaff.length) {
      return null;
    }

    return (
      <TouchableOpacity
        className="bg-[#ccac00] rounded-md p-1 text-center w-[40%] mt-4 mx-auto"
        onPress={handleLoadMore}
      >
        <Title className="text-white text-center text-sm text-semibold">
          Xem thêm
        </Title>
      </TouchableOpacity>
    );
  };

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
      {staff && (
        <Text className="my-2 ml-2 font-semibold">
          Tổng có: {staff.length} Nhân viên
        </Text>
      )}
      <FlatList
        data={filteredStaff.slice(0, visibleStaffs)}
        ListFooterComponent={renderFooter} // Thêm footer cho FlatList
        renderItem={({ item, index }) => (
          <RenderStaffItem
            item={item}
            index={index}
            handleToggle={handleToggle}
            navigation={navigation}
            userId={userId}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={useGetAllStaff}
      />

      {/* Modal for adding new staff */}
      <Modal visible={modalVisibleAdd} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title className="font-semibold text-xl mb-5 text-[#ccac00]">
              Tạo Account Mới
            </Title>

            <View className="w-full">
              <Text className="text-[12px] font-semibold mb-2">
                Tên nhân viên
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={newStaffData.name}
                onChangeText={(text) => handleChange("name", text)}
              />
              <Text className="text-right text-[12px] flex-row justify-end">
                {newStaffData.name.length}/{MAX_NAME_LENGTH}
              </Text>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View className="w-full">
              <Text className="text-[12px] font-semibold mb-2">Nhập email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={newStaffData.email}
                onChangeText={(text) => handleChange("email", text)}
                autoCapitalize="none"
                mode="outlined"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View className="w-full">
              <Text className="text-[12px] font-semibold mb-2">
                Nhập password
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={newStaffData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                mode="outlined"
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View className="w-full">
              <Text className="text-[12px] font-semibold mb-2">
                Nhập lại password
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={newStaffData.confirm_password}
                onChangeText={(text) => handleChange("confirm_password", text)}
                secureTextEntry
              />
              {errors.confirm_password && (
                <Text style={styles.errorText}>{errors.confirm_password}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.addButton2,
                !isFormValidAdd() && styles.disabledButton,
              ]}
              onPress={handleCreateStaff}
              disabled={!isFormValidAdd()}
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

const RenderStaffItem = ({ item, index, handleToggle, navigation, userId }) => {
  const { data: counterDetail } = useGetCounterById(item.assigned_counter);
  // console.log("counterDetail", counterDetail);

  return (
    <TouchableOpacity style={styles.staffCard} className="shadow-md">
      <View className="flex-row ">
        <Text className="font-semibold mr-4">#{index + 1}</Text>
        <View className="w-[90%]">
          <View className="flex-row justify-between">
            <Text style={styles.staffName}>
              {item.name}
              {userId === item._id && <Text className="font-bold"> (Bạn)</Text>}
            </Text>
            <Text className="text-[#937C00] font-semibold">{item.email}</Text>
          </View>
          <Text className="text-xs text-gray mb-3">
            {moment(item.created_at).format("DD/MM/YYYY, hh:mm A")}
          </Text>

          <View className=" flex-row items-center">
            <Text className="text-sm font-semibold mr-3">Vị trí:</Text>
            <Text className="uppercase font-bold text-gray-600">
              {item.role === 0 ? "Quản lý" : "Nhân viên"}
            </Text>
          </View>

          {counterDetail ? (
            <View className="mb-4 flex-row items-center">
              <Text className="text-sm font-semibold mr-3">Quầy quản lý:</Text>
              <Text>{counterDetail.counter_name}</Text>
            </View>
          ) : (
            <View className="mb-4 flex-row">
              <Text className="text-sm font-semibold mr-3">Quầy quản lý:</Text>
              <Text>Chưa được phân quyền</Text>
            </View>
          )}
        </View>
      </View>
      <View className="flex-row justify-between  items-center mx-2">
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleToggle(item)}
          // disabled={userId === item._id}
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
            navigation.navigate("StaffDetail", {
              staffId: item._id,
              userId: userId,
            })
          }
        >
          <Text style={styles.viewDetailButtonText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: "#9E9E9E",
  },
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
