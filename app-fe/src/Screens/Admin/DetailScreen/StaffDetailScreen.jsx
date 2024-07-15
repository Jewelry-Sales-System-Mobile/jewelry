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
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";
import {
  useGetStaffById,
  useSetToManager,
  useSetToStaff,
  useUpdateStaff,
} from "../../../API/staffApi";
import { Modal, Portal, Provider, Title } from "react-native-paper";
import { useGetCounterById } from "../../../API/counter";
import { FontAwesome } from "@expo/vector-icons";

const StaffDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { staffId, userId } = route.params;
  const { data: staff, isLoading, error, refetch } = useGetStaffById(staffId);
  const {
    data: counterDetail,
    isLoading: counterLoading,
    error: counterError,
  } = useGetCounterById(staff?.assigned_counter);

  const { mutate: setToManager } = useSetToManager();
  const { mutate: setToStaff } = useSetToStaff();

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [newName, setNewName] = useState(staff?.name || "");
  const [originalName, setOriginalName] = useState(staff?.name || "");

  const { mutate: updateStaffName } = useUpdateStaff();

  useEffect(() => {
    if (modalVisible) {
      setNewName(staff?.name || ""); // Reset newName when modal opens
      setOriginalName(staff?.name || ""); // Set originalName when staff data loads
    }
  }, [modalVisible, staff]);

  const handleRoleChange = () => {
    if (staff && staff.role === 1) {
      setToManager(staffId, {
        onSuccess: () => {
          refetch();
          setConfirmModalVisible(false);
        },
      });
    } else {
      setToStaff(staffId, {
        onSuccess: () => {
          refetch();
          setConfirmModalVisible(false);
        },
      });
    }
  };

  const showConfirmModal = () => {
    setConfirmModalVisible(true);
  };

  const hideConfirmModal = () => {
    setConfirmModalVisible(false);
  };

  const buttonText =
    staff?.role === 1 ? "Cấp quyền Quản Lý" : "Chuyển quyền Nhân Viên";
  const buttonColor = staff?.role === 1 ? "#4CAF50" : "#f44336";

  const handleUpdate = () => {
    updateStaffName({ staffId, updatedFields: { name: newName } });
    setModalVisible(false);
  };
  // Enable the update button only if newName is different from originalName
  const isNameChanged = newName !== originalName;

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Có lỗi xảy ra khi tải chi tiết nhân viên.</Text>;

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

  const status = getStatus(staff.verify);

  return (
    <Provider>
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
            <Text style={styles.detailTitle}>
              {staff.name}
              {userId === staff._id && (
                <Text className="font-bold"> (Bạn)</Text>
              )}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.staffEmail}>{staff.email}</Text>
          <View className="flex-row justify-between">
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vị trí:</Text>
              <Text style={styles.detailText}>
                {staff && staff.role === 0 ? "Quản lý" : "Nhân viên"}
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
            <Text>
              {moment(staff.created_at).format("DD/MM/YYYY, hh:mm A")}
            </Text>
          </View>
          <View className="text-xs flex-row ">
            <Text>Ngày sửa lần cuối:</Text>
            <Text>
              {moment(staff.updated_at).format("DD/MM/YYYY, hh:mm A")}
            </Text>
          </View>
        </ImageBackground>
        {userId !== staff._id && (
          <Button
            title={buttonText}
            color={buttonColor}
            onPress={showConfirmModal}
          />
        )}

        <Portal>
          <Modal visible={confirmModalVisible} onDismiss={hideConfirmModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Title className="text-sm text-center my-3 font-semibold">
                  Xác nhận chuyển quyền
                </Title>
                <Title className="text-sm text-center my-2">
                  Bạn có chắc chắn muốn {buttonText} này?
                </Title>
                <View className="flex-row justify-around w-full">
                  <TouchableOpacity
                    style={styles.addButton3}
                    onPress={handleRoleChange}
                    className="w-1/3"
                  >
                    <Text style={styles.buttonText}>Xác nhận</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton1}
                    onPress={hideConfirmModal}
                    className="w-1/3"
                  >
                    <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>

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
    </Provider>
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

export default StaffDetailScreen;
