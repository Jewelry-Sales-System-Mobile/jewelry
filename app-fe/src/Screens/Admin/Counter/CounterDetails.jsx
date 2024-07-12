import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  useGetCounterById,
  useUnassignEmployee,
  useDeleteCounter,
} from "../../../API/counter";
import { useGetStaffById } from "../../../API/staffApi";
import EmployeeDetails from "../../../components/Counter/EmployeeDetails";
import { Dialog, Portal, Button, Paragraph } from "react-native-paper";
import { showErrorMessage } from "../../../Utils/notifications";

export default function CounterDetails({ navigation }) {
  const route = useRoute();
  const { id: counterId } = route.params;
  const { data, isLoading, error } = useGetCounterById(counterId);
  const { mutate: deleteCounter } = useDeleteCounter();
  const { mutate: unassignEmployee } = useUnassignEmployee();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [employeeToUnassign, setEmployeeToUnassign] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const { data: employeeData } = useGetStaffById(employeeToUnassign);

  useEffect(() => {
    if (employeeData) {
      setEmployeeName(employeeData.name);
    }
  }, [employeeData]);

  const handleDelete = () => {
    if (data.assignedEmployees.length === 0) {
      // Thực hiện xóa quầy hàng
      setDeleteDialogVisible(true);
    } else {
      // Hiển thị thông báo lỗi
      showErrorMessage(
        "Vui lòng kick tất cả nhân viên khỏi quầy rồi mới xoá quầy!"
      );
    }
  };

  const confirmDeleteCounter = () => {
    deleteCounter(counterId, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
    setDeleteDialogVisible(false);
  };

  const handleUnassignEmployee = (employeeId) => {
    setEmployeeToUnassign(employeeId);
    setDialogVisible(true);
  };

  const confirmUnassignEmployee = () => {
    if (employeeToUnassign) {
      unassignEmployee({ counterId, employeeId: employeeToUnassign });
      setDialogVisible(false);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    console.error("Error loading counters:", error);
    return <Text>Error loading data</Text>;
  }

  return (
    <View className="p-3 bg-white flex-1">
      <View className="bg-amber-200 flex justify-between items-center px-6 py-4 rounded-lg shadow-lg shadow-black/25 mb-3">
        <Text className="">
          Tên quầy:{" "}
          <Text className="font-semibold text-lg ">{data?.counter_name}</Text>
        </Text>
      </View>
      <View className="flex flex-row items-center justify-evenly gap-5 mb-6">
        <TouchableOpacity
          onPress={handleDelete}
          className={`flex flex-row ${
            data.assignedEmployees.length === 0 ? "opacity-100" : "opacity-50"
          }`}
        >
          <Ionicons name="trash-outline" size={20} color="red" />
          <Text className="italic text-red-600 text-base">Xoá quầy hàng</Text>
        </TouchableOpacity>
        <Text>|</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Cập nhật thông tin quầy hàng", {
              id: data?._id,
            })
          }
          className="flex flex-row"
        >
          <Text className="italic text-blue-700 text-base">Thay đổi</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color="#A6A5A5"
          />
        </TouchableOpacity>
      </View>

      <View className="px-4 mb-2 mt-4">
        <View className="flex flex-row items-center mb-2">
          <Ionicons name="bookmarks-outline" size={22} color="#333333" />
          <Text className="uppercase font-medium text-lg ml-1">
            Thông tin quầy hàng
          </Text>
        </View>

        <View className="flex flex-row justify-between px-6 mb-2">
          <Text>Ngày tạo:</Text>
          <Text>{format(new Date(data?.created_at), "dd-MM-yyyy HH:mm")}</Text>
        </View>
        <View className="flex flex-row justify-between px-6">
          <Text>Cập nhật lần cuối:</Text>
          <Text>{format(new Date(data?.updated_at), "dd-MM-yyyy HH:mm")}</Text>
        </View>
      </View>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Icon icon="alert" color="#ccac00" size={30} />
          <Dialog.Title className="text-center font-medium">
            Xoá nhân viên?
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph className="text-center italic text-base">
              Bạn có chắc chắn muốn xoá nhân viên{" "}
              <Text className="font-semibold text-red-500">{employeeName}</Text>{" "}
              khỏi quầy?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>
              <Text className="text-black">Huỷ</Text>
            </Button>
            <Button onPress={confirmUnassignEmployee}>Đồng ý</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Icon icon="alert" color="#ccac00" size={30} />
          <Dialog.Title className="text-center font-medium">
            Xoá quầy hàng?
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph className="text-center italic text-base">
              Bạn có chắc chắn muốn xoá quầy hàng{" "}
              <Text className="font-semibold text-red-500">
                {data?.counter_name}
              </Text>
              ?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              <Text className="text-black">Huỷ</Text>
            </Button>
            <Button onPress={confirmDeleteCounter}>Đồng ý</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View className="px-4 mt-2">
        <View className="flex flex-row items-center justify-between mt-6 mb-6">
          <View className="flex flex-row items-center">
            <Ionicons name="people-outline" size={22} color="#333333" />
            <Text className="uppercase font-medium text-lg ml-1">
              Nhân viên phụ trách ({data?.assignedEmployees.length})
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Phân công nhân viên", { id: data?._id })
            }
            className=" flex items-center justify-end px-1 "
          >
            <Ionicons name="add-circle-sharp" size={35} color="#ccac00" />
            {/* <Text className=" font-semibold text-sm text-white">Phân công</Text> */}
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-end justify-end gap-3">
          {/* {data?.assignedEmployees.length > 1 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Phân công nhân viên", { id: data?._id })
              }
              className="bg-[#ccac00] rounded-lg w-[100px] flex items-center justify-end px-1 py-2 mb-3"
            >
              <Text className=" font-semibold text-sm text-white">
                Xoá tất cả 
              </Text>
            </TouchableOpacity>
          )} */}
        </View>

        {data?.assignedEmployees.length === 0 ? (
          <View className="items-center my-3">
            <Ionicons name="file-tray" size={50} color="#A6A5A5" />
            <Text className="text-base italic text-red-400 font-medium">
              Chưa có thông tin
            </Text>
          </View>
        ) : (
          <View className="flex flex-col px-1 mb-2">
            {data?.assignedEmployees?.map((employeeId, index) => (
              <EmployeeDetails
                key={index}
                employeeId={employeeId}
                onUnassign={handleUnassignEmployee}
                index={index}
                navigation={navigation}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
