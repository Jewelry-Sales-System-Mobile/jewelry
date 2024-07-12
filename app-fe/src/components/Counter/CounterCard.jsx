import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { format } from "date-fns";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Dialog, Portal, Button, Paragraph } from "react-native-paper";
import { useDeleteCounter } from "../../API/counter";

export default function CounterCard({ counters }) {
  const [showAll, setShowAll] = useState(false);
  const displayedData = showAll ? counters : counters.slice(0, 4);
  const navigation = useNavigation();

  const { mutate: deleteCounter } = useDeleteCounter();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedCounterId, setSelectedCounterId] = useState(null);

  const handleDelete = (id) => {
    setSelectedCounterId(id);
    setDeleteDialogVisible(true);
  };

  const confirmDeleteCounter = () => {
    deleteCounter(selectedCounterId);
    setDeleteDialogVisible(false);
  };

  return (
    <View className="flex flex-1 w-full px-2">
      <View className="w-full px-4 mb-2">
          <Text className="text-lg font-semibold">
            Tổng số quầy hàng: {counters.length}
          </Text>
        </View>
      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            className="bg-white flex border-t-2 border-neutral-200 px-6 pt-5 pb-3 rounded-lg shadow-lg shadow-black/25 mb-3"
            onPress={() =>
              navigation.navigate("Chi tiết quầy hàng", { id: item._id })
            }
          >
            <View className="w-full">
              <Portal>
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
                        {item.counter_name}
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

              <View className="flex flex-row justify-between">
                <Text
                  className="text-lg line-clamp-1 w-3/4 font-semibold mb-2"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.counter_name}
                </Text>
                <Menu>
                  <MenuTrigger>
                    <Ionicons name="ellipsis-vertical" size={24} />
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption
                      onSelect={() =>
                        navigation.navigate("Cập nhật thông tin quầy hàng", {
                          id: item._id,
                        })
                      }
                    >
                      <View className="flex flex-row items-center px-4 py-3">
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="#ccac00"
                        />
                        <Text className="ml-2 text-center font-normal">
                          Cập nhật quầy hàng
                        </Text>
                      </View>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDelete(item._id)}>
                      <View className="flex flex-row items-center px-4 py-3">
                        <Ionicons name="trash-outline" size={20} color="red" />
                        <Text className="ml-2 text-center text-red-600">
                          Xoá quầy hàng
                        </Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>

              <View>
                <View className="flex flex-row items-center gap-2 mb-2">
                  <Ionicons name="people" size={20} color="#ccac00" />
                  <Text>
                    Nhân viên phụ trách: {item.assignedEmployees.length}
                  </Text>
                </View>

                <View className="flex flex-row items-center gap-2 mb-2">
                  <Ionicons name="time-outline" size={20} color="#ccac00" />
                  <Text>
                    Cập nhật lần cuối:{" "}
                    {format(new Date(item.updated_at), "dd-MM-yyyy HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
      {!showAll && counters.length > 4 && (
        <Pressable
          onPress={() => setShowAll(true)}
          className="mb-5 items-center p-5"
        >
          <Text className="font-semibold italic">Xem thêm...</Text>
        </Pressable>
      )}
    </View>
  );
}
