import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
import { format } from "date-fns";

const GoldPriceManagement = ({ info }) => {
  const { data: goldPrices, isLoading, error, isFetching } = useGetGoldPrices();
  const updateGoldPricesMutation = useUpdateGoldPrices();

  const [modalVisible, setModalVisible] = useState(false);
  const [newPrices, setNewPrices] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorTimeout, setErrorTimeout] = useState(null);

  useEffect(() => {
    if (goldPrices) {
      console.log("Gold Prices: ", goldPrices);
    }
  }, [goldPrices]);

  const handleUpdatePrices = () => {
    updateGoldPricesMutation.mutate(newPrices);
    setModalVisible(false);
  };

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

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading gold prices: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Giá vàng (Vàng 24K)</Text>
      {goldPrices && (
        <View>
          <Text className="text-gray-600 text-xs ">
            Ngày cập nhật giá vàng:{" "}
            {format(new Date(goldPrices.updated_at), "p, dd/MM/yyyy")}
          </Text>
          <Text style={styles.unitText}>Đơn vị: 1 Lượng = 37.5 gram</Text>
          <View style={styles.priceContainer}>
            <View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Giá mua:</Text>
                <Text style={styles.priceValue}>
                  {goldPrices.buy_price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Giá bán:</Text>
                <Text style={styles.priceValue}>
                  {goldPrices.sell_price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Text>
              </View>
            </View>
            {info.role === 0 && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleOpenModal}
              >
                <MaterialIcons name="edit" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa Giá vàng</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Giá mua:</Text>
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
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Giá bán:</Text>
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
                styles.saveButton,
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
  container: {
    width: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateText: {
    color: "gray",
    fontSize: 12,
    marginBottom: 4,
  },
  unitText: {
    color: "gray",
    fontSize: 12,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceLabel: {
    marginRight: 4,
    fontWeight: "bold",
    fontSize: 14,
  },
  priceValue: {
    color: "#ccac00",
    fontWeight: "bold",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#ccac00",
    padding: 8,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 20,
    color: "#ccac00",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
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
  saveButton: {
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

export default GoldPriceManagement;
