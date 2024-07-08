import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useDeleteCounter, useGetCounterById } from "../../../API/counter";
import { useRoute, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Modal, Portal, Button, TextInput, Provider as PaperProvider } from 'react-native-paper';

export default function CounterDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: counterId } = route.params;
  const { data, isLoading, error } = useGetCounterById(counterId);
  const { mutate: deleteCounter } = useDeleteCounter({
    onSuccess: () => {
      navigation.navigate("Counter");
    },
  });
  
  const [visible, setVisible] = useState(false);
  const [counterName, setCounterName] = useState(data?.counter_name || '');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.error("Error loading counters:", error);
    return (
      <View>
        <Text>Error loading data: {error.message}</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteCounter(counterId);
  };

  const handleUpdate = () => {
    // Implement the update logic here
    console.log("Updated counter name:", counterName);
    hideModal();
  };

  return (
    <PaperProvider>
      <View>
        <View className="bg-white flex border-t-2 border-neutral-200 px-6 pt-5 pb-3 rounded-lg shadow-lg shadow-black/25 mb-3">
          <View className="flex flex-row justify-between">
            <Text>
              Tên quầy:{" "}
              <Text className="font-semibold text-base">
                {data?.counter_name}
              </Text>
            </Text>
            <TouchableOpacity onPress={handleDelete}>
              <Icon name="trash-can-outline" size={25} color="red" />
            </TouchableOpacity>
          </View>

          <Text>
            Ngày tạo: {format(new Date(data?.created_at), "dd-MM-yyyy")}
          </Text>
          <Text className="italic">
            Cập nhật lần cuối:{" "}
            {format(new Date(data?.created_at), "dd-MM-yyyy HH:mm")}
          </Text>

          <TouchableOpacity
            onPress={showModal}
            className="bg-slate-400 rounded-lg w-fit items-center mx-auto px-3 py-2 mt-4 mb-2"
          >
            <Text>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text>
            Nhân viên phụ trách:{" "}
            {data?.assignedEmployees.length === 0 ? (
              <View>
                <Text className="italic text-red-500">Chưa có thông tin</Text>
                <TouchableOpacity
                  onPress={showModal}
                  className="bg-slate-400 rounded-lg w-fit items-center mx-auto px-3 py-2 mt-4 mb-2"
                >
                  <Text>Phân công</Text>
                </TouchableOpacity>
              </View>
            ) : (
              data?.assignedEmployees
            )}
          </Text>
        </View>
      </View>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Cập nhật thông tin</Text>
          <TextInput
            label="Tên quầy"
            value={counterName}
            onChangeText={setCounterName}
            style={{ marginBottom: 10 }}
          />
          <Button mode="contained" onPress={handleUpdate}>
            Cập nhật
          </Button>
        </Modal>
      </Portal>
    </PaperProvider>
  );
}