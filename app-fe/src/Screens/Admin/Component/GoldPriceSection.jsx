// GoldPriceManagement.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import { useGetGoldPrices, useUpdateGoldPrices } from "./api"; // Đổi lại thành tên file chứa API của bạn
import { showErrorMessage } from "../../../Utils/notifications";
import {
  useGetGoldPrices,
  useUpdateGoldPrices,
} from "../../../API/goldPriceApi";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";

const GoldPriceManagement = () => {
  const { data: goldPrices, isLoading, error, isFetching } = useGetGoldPrices();
  const updateGoldPricesMutation = useUpdateGoldPrices();

  console.log("goldPrices", goldPrices);

  const [modalVisible, setModalVisible] = useState(false);
  const [newPrices, setNewPrices] = useState({});
  const [isValid, setIsValid] = useState(false); // State để xác định nút "Lưu" có được kích hoạt hay không
  const [errorText, setErrorText] = useState(""); // State để lưu trữ thông báo lỗi
  const [errorTimeout, setErrorTimeout] = useState(null);
  const [inputValue, setInputValue] = useState(""); // State để lưu trữ giá trị nhập vào từ TextInput
  const [initialPrices, setInitialPrices] = useState({}); // Giá trị khởi tạo ban đầu

  useEffect(() => {
    if (goldPrices) {
      setInitialPrices(goldPrices);
    }
  }, [goldPrices]);

  console.log("errorText", errorText);
  const handleUpdatePrices = () => {
    updateGoldPricesMutation.mutate(newPrices);
    setModalVisible(false);
  };

  //   const handleOpenModal = () => {
  //     setNewPrices(goldPrices); // Khởi tạo giá trị ban đầu với giá vàng hiện tại
  //     setModalVisible(true);
  //   };

  const handleOpenModal = () => {
    setNewPrices({
      buy_price: goldPrices?.buy_price,
      sell_price: goldPrices?.sell_price,
    });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleChangePrice = (text, type) => {
    const price = parseFloat(text);
    if (!isNaN(price) && price >= 0) {
      if (price > 200000000) {
        setErrorText("Giá trị không được vượt quá 200,000,000");
        if (errorTimeout) {
          clearTimeout(errorTimeout);
        }
        setErrorTimeout(
          setTimeout(() => {
            setErrorText("");
          }, 3000)
        );
        setIsValid(false);
      } else {
        setNewPrices({
          ...newPrices,
          [type]: price,
        });
        setIsValid(true);
        setErrorText("");
      }
    } else {
      setIsValid(false);
      setErrorText("Giá trị không hợp lệ");
    }
  };

  return (
    <View className="w-[90%]">
      <Text style={styles.title}>Quản lý Giá vàng (Vàng 24K)</Text>
      {goldPrices && (
        <View>
          <Text className="text-gray-600 text-xs ">
            Ngày cập nhật giá vàng: {goldPrices.updated_at}
          </Text>
          <Text className="text-gray-600 text-xs mb-4">
            Đơn vị: 1 Lượng = 37.5 gram
          </Text>
          <View className="flex-row justify-between items-center">
            <View>
              <View className="flex-row ">
                <Text className="mr-4 font-semibold text-sm">Giá mua:</Text>
                <Text className="text-[#ccac00] font-semibold text-lg">
                  {" "}
                  {goldPrices.buy_price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </Text>
              </View>

              <View className="flex-row ">
                <Text className="mr-4 text-left font-semibold text-sm mb-4">
                  {" "}
                  Giá bán:{" "}
                </Text>
                <Text className="text-[#ccac00] font-semibold text-lg">
                  {" "}
                  {goldPrices.sell_price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-[#ccac00] p-2 rounded-md">
              <MaterialIcons
                name="edit"
                size={20}
                color="white"
                onPress={handleOpenModal}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Nút để mở modal chỉnh sửa */}

      {/* Modal chỉnh sửa Giá vàng */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text className="font-semibold text-xl mb-5 text-[#ccac00]">
              Chỉnh sửa Giá vàng
            </Text>

            <View className="w-full">
              <Text className="text-[12px] font-semibold mb-2">Giá mua:</Text>
              <TextInput
                style={[styles.input, errorText ? styles.inputError : null]}
                placeholder="Nhập giá mua mới"
                keyboardType="numeric"
                value={
                  newPrices.buy_price ? newPrices.buy_price.toString() : ""
                }
                onChangeText={(text) => handleChangePrice(text, "buy_price")}
              />
            </View>

            <View className="w-full">
              <Text className="text-[12px] font-semibold mb-2">Giá bán:</Text>
              <TextInput
                style={[styles.input, errorText ? styles.inputError : null]}
                placeholder="Nhập giá bán mới"
                keyboardType="numeric"
                value={
                  newPrices.sell_price ? newPrices.sell_price.toString() : ""
                }
                onChangeText={(text) => handleChangePrice(text, "sell_price")}
              />
            </View>

            {errorText ? (
              <Text style={styles.errorText}>{errorText}</Text>
            ) : null}
            <TouchableOpacity
              style={[
                styles.addButton2,
                {
                  backgroundColor: isValid ? "#ccac00" : "#ccc",
                },
              ]}
              onPress={handleUpdatePrices}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseModal}
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },

  cancelButton: {
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
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
});

export default GoldPriceManagement;
