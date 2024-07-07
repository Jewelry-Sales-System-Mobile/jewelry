import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"; // Cần cài đặt expo/vector-icons
import { showSuccessMessage } from "../../../Utils/notifications";

const FilterDropdown = ({ onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false); // State để kiểm soát hiển thị modal
  const [sortBy, setSortBy] = useState(null); // State để lưu trữ trạng thái sắp xếp
  const [isFiltered, setIsFiltered] = useState(false); // State để kiểm soát việc đã lọc hay chưa

  const filterLabels = {
    basePrice: "Giá",
    created_at: "Ngày tạo",
    weight: "Khối lượng",
  };

  const handleToggleExpand = () => {
    setModalVisible(!modalVisible);
  };

  const handleFilterChange = (type) => {
    let order;
    if (sortBy === type) {
      setSortBy(`-${type}`);
      onFilterChange(`-${type}`);
      order = "giảm dần";
    } else {
      setSortBy(type);
      onFilterChange(type);
      order = "tăng dần";
    }
    setIsFiltered(true);
    setModalVisible(false);
    showSuccessMessage(`Lọc theo ${filterLabels[type]} (${order}) thành công`);
  };

  const handleResetFilter = () => {
    setSortBy(null); // Không áp dụng bộ lọc
    onFilterChange(null);
    setIsFiltered(false); // Chưa lọc
    setModalVisible(false); // Đóng modal
    showSuccessMessage("Đặt lại bộ lọc thành công");
  };

  const getFilterText = () => {
    if (sortBy) {
      const type = sortBy.startsWith("-") ? sortBy.substring(1) : sortBy;
      const order = sortBy.startsWith("-") ? " (giảm dần)" : " (tăng dần)";
      return `Đang lọc theo ${filterLabels[type]}${order}`;
    }
    return "";
  };

  const getOptionText = (type) => {
    const order = sortBy === type ? " (giảm dần)" : " (tăng dần)";
    return `Lọc theo ${filterLabels[type]}${order}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={handleToggleExpand}
      >
        {isFiltered ? (
          <MaterialCommunityIcons name="filter-check" size={24} color="black" />
        ) : (
          <MaterialIcons name="filter-list" size={24} color="black" />
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.filterInfoText}>{getFilterText()}</Text>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleFilterChange("basePrice")}
            >
              <Text style={styles.optionText}>
                {getOptionText("basePrice")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleFilterChange("created_at")}
            >
              <Text style={styles.optionText}>
                {getOptionText("created_at")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleFilterChange("weight")}
            >
              <Text style={styles.optionText}>{getOptionText("weight")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetFilter}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  filterInfoText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
  },
  resetButton: {
    marginTop: 10,
    alignItems: "center",
  },
  resetButtonText: {
    color: "red",
    fontSize: 16,
  },
});

export default FilterDropdown;
