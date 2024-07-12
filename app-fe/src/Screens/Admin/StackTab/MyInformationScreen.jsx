import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useGetCounterById } from "../../../API/counter";
import { useUpdateStaff } from "../../../API/staffApi";
import moment from "moment";
import { Modal, Portal, Provider, Title } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

const MyInformationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(myInfo?.name || "");
  const [originalName, setOriginalName] = useState(myInfo?.name || "");

  const { info: myInfo } = route.params;
  const {
    data: counterDetail,
    isLoading: counterLoading,
    error: counterError,
  } = useGetCounterById(myInfo?.assigned_counter);

  const { mutate: updateStaffName } = useUpdateStaff();

  useEffect(() => {
    if (modalVisible) {
      setNewName(myInfo?.name || ""); // Reset newName when modal opens
      setOriginalName(myInfo?.name || ""); // Set originalName when staff data loads
    }
  }, [modalVisible, myInfo]);

  const staffId = myInfo?._id;

  const handleUpdate = () => {
    updateStaffName({ staffId, updatedFields: { name: newName } });
    setModalVisible(false);
  };

  // Enable the update button only if newName is different from originalName
  const isNameChanged = newName !== originalName;

  const getStatus = (verify) => {
    switch (verify) {
      case 0:
        return { text: "Vô hiệu hoá", style: styles.statusBanned };
      case 1:
        return { text: "Đã xác thực", style: styles.statusVerified };
      case 2:
        return { text: "Bị Cấm", style: styles.statusBanned };
      default:
        return { text: "Không rõ", style: styles.statusUnknown };
    }
  };

  const status = getStatus(myInfo.verify);

  console.log("myInfo", myInfo);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          //   uri: "https://t3.ftcdn.net/jpg/02/39/33/18/360_F_239331859_KzBYfbPVwtYOwyrsqZ6sHXMHxMYiA5OL.jpg",
          uri: "https://img.freepik.com/premium-vector/minimal-geometric-white-background-with-dynamic-shapes-composition_573652-135.jpg",
        }}
        style={styles.staffDetailCard}
        imageStyle={{ borderRadius: 8 }}
      >
        <View style={styles.headerRow}>
          <Text style={styles.detailTitle}>{myInfo.name}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.staffEmail}>{myInfo.email}</Text>
        <View className="flex-row justify-between">
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vị trí:</Text>
            <Text style={styles.detailText}>
              {myInfo && myInfo.role === 0 ? "Quản lý" : "Nhân viên"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text
              style={[styles.detailText, status.style]}
              className="font-semibold"
            >
              {status.text}
            </Text>
          </View>
        </View>
        {counterDetail ? (
          <View className="flex-row ">
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quầy quản lý:</Text>
              <Text
                style={styles.detailText}
                className="underline font-semibold mr-2"
                onPress={() =>
                  navigation.navigate("Chi tiết quầy hàng", {
                    id: counterDetail._id,
                  })
                }
              >
                {counterDetail?.counter_name}
              </Text>
            </View>
            <FontAwesome
              name="hand-o-right"
              size={16}
              color="#ccac0"
              className="self-end"
              style={styles.icon}
            />
          </View>
        ) : (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quầy quản lý:</Text>
            <Text style={styles.detailText}>Chưa được phân quyền</Text>
          </View>
        )}
        <View className="text-xs flex-row mt-6">
          <Text>Ngày tạo:</Text>
          <Text>{moment(myInfo.created_at).format("DD/MM/YYYY, hh:mm A")}</Text>
        </View>
        <View className="text-xs flex-row ">
          <Text>Ngày sửa lần cuối:</Text>
          <Text>{moment(myInfo.updated_at).format("DD/MM/YYYY, hh:mm A")}</Text>
        </View>
      </ImageBackground>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title className="font-semibold text-xl mb-5 text-[#ccac00]">
              Cập nhật tên nhân viên
            </Title>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên mới"
              value={newName}
              onChangeText={setNewName}
            />
            <TouchableOpacity
              style={[
                styles.addButton2,
                !isNameChanged && styles.disabledButton,
              ]}
              onPress={handleUpdate}
              disabled={!isNameChanged}
            >
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ccac0073",
  },
  staffDetailCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#937C00",
  },
  staffEmail: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#937C00",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
  },
  statusUnverified: {
    color: "#FFC600", // Yellow for unverified
  },
  statusVerified: {
    color: "#008000", // Green for verified
  },
  statusBanned: {
    color: "#FF0000", // Red for banned
  },
  statusUnknown: {
    color: "#555", // Gray for unknown status
  },
  editIcon: {
    fontSize: 18,
    color: "#937C00",
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
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton2: {
    backgroundColor: "#ccac00",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  addButton3: {
    backgroundColor: "#ccac00",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "30%",
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
  cancelButton1: {
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "30%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9E9E9E",
  },
});

export default MyInformationScreen;
