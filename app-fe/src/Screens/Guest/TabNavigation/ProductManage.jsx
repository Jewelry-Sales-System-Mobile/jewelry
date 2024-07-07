import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  useActivateProduct,
  useAddProductImage,
  useCreateProduct,
  useDeleteProduct,
  useDeleteProductImage,
  useGetProducts,
  useInactivateProduct,
  useUpdateProduct,
} from "../../../API/productApi";
import { Image } from "react-native";
import { Card, Title, Paragraph, Button, Modal } from "react-native-paper";
import moment from "moment";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "react-native-image-picker";
import Constants from "expo-constants";

const ProductManagementScreen = () => {
  const { data: products, isLoading, error, isFetching } = useGetProducts();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProductImage } = useDeleteProductImage();
  const { mutate: addProductImage } = useAddProductImage();
  const { mutate: inactivateProduct } = useInactivateProduct();
  const { mutate: activateProduct } = useActivateProduct();
  console.log(products, "products");

  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold selected product
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [imageSource, setImageSource] = useState(null); // State to hold selected image
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false); // State để điều khiển hiển thị modal
  const [newProductData, setNewProductData] = useState({
    name: "",
    weight: "",
    gemCost: "",
  }); // State để lưu thông tin mới của sản phẩm
  const [tooltipVisible, setTooltipVisible] = useState(false); // State to control tooltip visibility
  const [tooltipText, setTooltipText] = useState(""); // State to hold tooltip text

  const handleToggleActive = (product) => {
    if (product.status === 0) {
      // Inactivate product
      inactivateProduct(product._id);
    } else {
      // Activate product
      activateProduct(product._id);
    }
    setModalVisible(false);
  };
  // Hàm mở modal
  const openModalAdd = () => {
    setModalVisibleAdd(true);
  };

  // Hàm đóng modal
  const closeModalAdd = () => {
    setModalVisibleAdd(false);
    // Đặt lại thông tin sản phẩm mới về trạng thái ban đầu khi đóng modal
    setNewProductData({
      name: "",
      weight: "",
      gemCost: "",
    });
  };

  // Hàm xử lý khi người dùng thay đổi dữ liệu nhập vào input
  const handleChange = (key, value) => {
    setNewProductData({
      ...newProductData,
      [key]: value,
    });
  };

  const handleUpdateProduct = (product) => {
    // Update product logic here
    updateProduct({
      productId: product._id,
      updatedFields: { name: "Updated Name", weight: 100 },
    });
  };

  const handleDeleteProductImage = (product) => {
    // Delete product logic here
    deleteProductImage(product._id);
  };

  const handleAddImage = (imageProduct) => {
    // Define options for image picker
    const options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    // Launch image picker
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        console.log("Selected image: ", response.uri);

        // Upload image using API
        const formData = new FormData();
        formData.append("image", {
          uri: response.uri,
          type: response.type,
          name: response.fileName,
        });

        console.log("FormData to be sent: ", formData);

        addProductImage({
          productId: imageProduct._id,
          imageFile: formData,
        });
      }
    });
  };

  const handleCreateProduct = () => {
    // Gọi hàm tạo sản phẩm từ API với dữ liệu mới đã nhập
    createProduct(newProductData);
    // Đóng modal sau khi tạo xong sản phẩm
    closeModalAdd();
  };

  const renderItem = ({ item, index }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Image
          source={{
            uri: item.image
              ? item.image
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJRS-4chjWMRAmrtz7ivK53K_uygrgjzw9Uw&s",
          }}
          style={styles.image}
        />
        <View style={styles.cameraIconContainer2}>
          <Feather
            name="camera"
            size={16}
            color="black"
            onPress={() => {
              setSelectedProduct(item);
              handleAddImage(item);
            }}
          />
        </View>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <Paragraph className="text-xs">
          {moment(item.created_at).format("DD/MM/YYYY, hh:mm A")}
        </Paragraph>
        <Title className="font-semibold text-lg ">
          [{item.productCode}] - {item.name}
        </Title>
        <Paragraph> {item.weight} Gram</Paragraph>
        <Paragraph className="text-right text-lg font-semibold text-[#ccac00]">
          {item.basePrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Paragraph>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleToggleActive(item)}
          >
            <FontAwesome
              name={item.status === 0 ? "toggle-on" : "toggle-off"}
              size={20}
              color={item.status === 0 ? "green" : "gray"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <MaterialIcons
              name="edit"
              size={20}
              color="gray"
              onPress={() => {
                setSelectedProduct(item);
                handleUpdateProduct(item);
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => {
              setSelectedProduct(item);
              setModalVisible(true);
            }}
          >
            <Feather name="eye" size={20} color="#998100" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome
              name="trash"
              onPress={() => {
                setSelectedProduct(item);
                handleDeleteProductImage(item);
              }}
              size={20}
              color="red"
            />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const viewDetails = (item) => {
    // Navigate to the detail screen with item details
    console.log("View details of:", item);
    // Example navigation:
    // navigation.navigate('ProductDetailScreen', { productId: item._id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm Trang sức</Text>
      <View style={styles.buttonContainer2} onPress={openModalAdd}>
        <TouchableOpacity style={styles.button1} onPress={openModalAdd}>
          <FontAwesome name="plus" size={20} color="white" />
          <Text style={{ color: "white", marginLeft: 10 }}>Tạo Sản Phẩm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator}></View> {/* Separator View */}
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item, index }) => renderItem({ item, index })}
          keyExtractor={(item) => item._id}
          numColumns={2} // Adjust as needed for your grid layout
        />
      )}
      {/* Modal for displaying product details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Card style={styles.modalCard}>
            {selectedProduct && (
              <>
                <Card.Content>
                  <Image
                    source={{
                      uri: selectedProduct.image
                        ? selectedProduct.image
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJRS-4chjWMRAmrtz7ivK53K_uygrgjzw9Uw&s",
                    }}
                    style={styles.modalImage}
                  />
                  <View style={styles.cameraIconContainer}>
                    <Feather
                      name="camera"
                      size={24}
                      color="black"
                      onPress={() => {
                        setSelectedProduct(selectedProduct);
                        handleAddImage(selectedProduct);
                      }}
                    />
                  </View>
                  <Title className="font-semibold text-lg ">
                    [{selectedProduct.productCode}] - {selectedProduct.name}
                  </Title>
                  <Paragraph className="text-xs">
                    {" "}
                    Ngày tạo:{" "}
                    {moment(selectedProduct.created_at).format(
                      "DD/MM/YYYY, hh:mm A"
                    )}
                  </Paragraph>
                  <Paragraph className="text-xs">
                    {" "}
                    Lần sửa cuối:{" "}
                    {moment(selectedProduct?.updated_at).format(
                      "DD/MM/YYYY, hh:mm A"
                    )}
                  </Paragraph>
                  <Paragraph> {selectedProduct.weight} Gram</Paragraph>
                  <Paragraph>
                    {" "}
                    Tiền công:{" "}
                    {selectedProduct?.laborCost?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                  </Paragraph>
                  <Paragraph>
                    {" "}
                    Tiền đá:{" "}
                    {selectedProduct?.gemCost?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                  </Paragraph>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setTooltipVisible(true);
                        setTooltipText(
                          selectedProduct.basePrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                        );
                      }}
                      onBlur={() => setTooltipVisible(false)}
                    >
                      <Paragraph className="text-right text-lg font-semibold text-[#ccac00]">
                        {selectedProduct.basePrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).length > 11
                          ? `${selectedProduct.basePrice
                              .toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })
                              .substring(0, 11)}...`
                          : selectedProduct.basePrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                      </Paragraph>
                    </TouchableOpacity>
                    {tooltipVisible && (
                      <Modal
                        visible={tooltipVisible}
                        onDismiss={() => setTooltipVisible(false)}
                        contentContainerStyle={styles.tooltipContainer}
                      >
                        <Text>{tooltipText} </Text>
                      </Modal>
                    )}
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleToggleActive(selectedProduct)}
                      >
                        <FontAwesome
                          name={
                            selectedProduct.status === 0
                              ? "toggle-on"
                              : "toggle-off"
                          }
                          size={20}
                          color={
                            selectedProduct.status === 0 ? "green" : "gray"
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button}>
                        <MaterialIcons
                          name="edit"
                          size={20}
                          color="gray"
                          onPress={() => {
                            setSelectedProduct(selectedProduct);
                            handleUpdateProduct(selectedProduct);
                          }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.button}>
                        <FontAwesome
                          name="trash"
                          size={20}
                          color="red"
                          onPress={() => {
                            setSelectedProduct(selectedProduct);
                            handleDeleteProductImage(selectedProduct);
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card.Content>
                <Button onPress={closeModal}>Close</Button>
              </>
            )}
          </Card>
        </View>
      </Modal>
      {/* Modal để nhập thông tin sản phẩm mới */}
      <Modal visible={modalVisibleAdd} animationType="slide" transparent={true}>
        <View style={[styles.modalContainer]}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Tên sản phẩm"
              value={newProductData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Khối lượng (gram)"
              value={newProductData.weight}
              onChangeText={(text) => handleChange("weight", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Chi phí đá (VND)"
              value={newProductData.gemCost}
              onChangeText={(text) => handleChange("gemCost", text)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.addButton2}
              onPress={handleCreateProduct}
            >
              <Text style={styles.buttonText}>Thêm sản phẩm</Text>
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
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 5,
    width: "45%", // Adjust width as per your design
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 150, // Adjust height as needed
    resizeMode: "cover", // or 'contain' as per your preference
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  indexContainer: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#ccac00", // Yellow color
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  indexText: {
    color: "white",
    fontSize: 10,
    fontWeight: 500,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  buttonContainer2: {
    flexDirection: "row",
    zIndex: 1,
    alignItems: "center",
    marginTop: 10,
  },

  button: {
    padding: 10,
    borderRadius: 5,
  },
  button1: {
    padding: 10,
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "#ccac00",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 300,
    marginBottom: 10,
    resizeMode: "cover",
  },
  cameraIconContainer: {
    position: "absolute",
    top: 280,
    right: 10,
    backgroundColor: "white",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cameraIconContainer2: {
    position: "absolute",
    top: 150,
    right: 10,
    backgroundColor: "white",
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
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
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  tooltipContainer: {
    backgroundColor: "white",
    top: -40,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default ProductManagementScreen;
