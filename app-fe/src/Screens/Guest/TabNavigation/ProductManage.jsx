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
import {
  Card,
  Title,
  Paragraph,
  Button,
  Modal,
  Searchbar,
  Menu,
  Provider,
} from "react-native-paper";
import moment from "moment";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "react-native-image-picker";
import Constants from "expo-constants";
import ActionDropdown from "../Component/ActionSection";
import FilterDropdown from "../Component/FilterDropdown";
import { useCartStore } from "../../../Zustand/CartForStaff.js";

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
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: "",
    weight: "",
    gemCost: "",
  }); // State để lưu thông tin mới của sản phẩm
  const [updatedProductData, setUpdatedProductData] = useState({
    name: "",
    weight: 0,
    gemCost: 0,
  });
  const [tooltipVisible, setTooltipVisible] = useState(false); // State to control tooltip visibility
  const [tooltipText, setTooltipText] = useState(""); // State to hold tooltip text
  const [searchText, setSearchText] = useState(""); // State to hold search text
  const [searchQuery, setSearchQuery] = useState("");
  // Dropdown menu actions
  const [visible, setVisible] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6); // Số sản phẩm hiển thị ban đầu
  const [sortBy, setSortBy] = useState(null);
  const { addProductToCart } = useCartStore();

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProductsSort = filteredProducts?.sort((a, b) => {
    if (sortBy === "basePrice") {
      return a.basePrice - b.basePrice;
    }
    if (sortBy === "-basePrice") {
      return b.basePrice - a.basePrice;
    }
    if (sortBy === "created_at") {
      return new Date(a.created_at) - new Date(b.created_at);
    }
    if (sortBy === "-created_at") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === "weight") {
      return a.weight - b.weight;
    }
    if (sortBy === "-weight") {
      return b.weight - a.weight;
    }
    return 0;
  });

  const handleFilterChange = (filter) => {
    setSortBy(filter);
  };

  const handleLoadMore = () => {
    setVisibleProducts(visibleProducts + 6); // Tăng số lượng sản phẩm hiển thị khi nhấn nút "Xem thêm"
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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
    // debugger;
    setNewProductData({
      ...newProductData,
      [key]: value,
    });
  };

  const handleUpdateChange = (key, value) => {
    setUpdatedProductData({
      ...updatedProductData,
      [key]: value,
    });
  };

  const handleSaveUpdate = () => {
    updateProduct({
      productId: selectedProduct._id,
      updatedFields: {
        name: updatedProductData.name,
        weight: parseFloat(updatedProductData.weight),
        gemCost: parseFloat(updatedProductData.gemCost),
      },
    });
    setModalVisibleUpdate(false);
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

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setUpdatedProductData({
      name: product.name,
      weight: +product.weight,
      gemCost: +product.gemCost,
    });
    setModalVisibleUpdate(true);
  };

  const handleCreateProduct = () => {
    // Gọi hàm tạo sản phẩm từ API với dữ liệu mới đã nhập
    createProduct({
      name: newProductData.name,
      weight: +newProductData.weight,
      gemCost: +newProductData.gemCost,
    });
    // Đóng modal sau khi tạo xong sản phẩm
    closeModalAdd();
  };

  const closeModalUpdate = () => {
    setModalVisibleUpdate(false);
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const renderItem = ({ item, index }) => {
    const formatCurrency = (value) => {
      // debugger;
      if (value == null || isNaN(value)) return "0 VND";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Number(value?.toFixed(2)));
    };

    const formattedPrice = formatCurrency(item?.basePrice);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.menuContainer}>
            <ActionDropdown
              item={item}
              handleUpdateProduct={handleUpdateProduct}
              setModalVisible={setModalVisible}
              setSelectedProduct={setSelectedProduct}
              handleDeleteProductImage={handleDeleteProductImage}
            />
          </View>
          <Title className="font-semibold  text-[14px] text-center ">
            #{item.productCode}
          </Title>
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
          <Title
            className="font-semibold text-[16px] "
            onPress={() => {
              setSelectedProduct(item);
              setModalVisible(true);
            }}
          >
            {item.name}
          </Title>

          <Paragraph> {item.weight} Gram</Paragraph>
          <View style={styles.buttonContainer}>
            <Paragraph className="text-right text-base font-semibold text-[#ccac00]">
              {formattedPrice}
            </Paragraph>
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
          </View>
          <TouchableOpacity
            className="bg-[#ccac00] rounded-md p-1 text-center mt-1 mx-auto"
            onPress={() => addProductToCart(item)}
          >
            <Text className="px-2 py-1 text-sm text-white font-semibold">
              Them vao gio
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const renderFooter = () => {
    // Kiểm tra nếu không còn sản phẩm để hiển thị thì không hiển thị nút "Xem thêm"
    if (visibleProducts >= filteredProducts.length) {
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
      <View className="flex-row p-2 justify-between">
        <Text style={styles.title}>Quản lý sản phẩm Trang Sức</Text>
        {/* <View style={styles.buttonContainer2} onPress={openModalAdd}>
          <TouchableOpacity
            className="flex-row  bg-[#ccac00] p-2 rounded-md mb-4 "
            onPress={openModalAdd}
          >
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <FilterDropdown onFilterChange={handleFilterChange} />
      </View>
      <View style={styles.separator}></View> {/* Separator View */}
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={filteredProductsSort.slice(0, visibleProducts)}
            renderItem={({ item, index }) => renderItem({ item, index })}
            keyExtractor={(item) => item._id}
            numColumns={2} // Adjust as needed for your grid layout
            contentContainerStyle={{ flexGrow: 1 }}
            ListFooterComponent={renderFooter} // Thêm footer cho FlatList
          />
        </View>
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
                        })}
                      </Paragraph>
                    </TouchableOpacity>
                    {/* {tooltipVisible && (
                      <Modal
                        visible={tooltipVisible}
                        onDismiss={() => setTooltipVisible(false)}
                        contentContainerStyle={styles.tooltipContainer}
                      >
                        <Text>{tooltipText} </Text>
                      </Modal>
                    )} */}
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
                          color="#8B0000"
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
      <Modal
        visible={modalVisibleUpdate}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModalUpdate}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Title className="font-semibold text-xl mb-10 text-[#ccac00]">
              Cập Nhật Sản Phẩm
            </Title>
            <TextInput
              style={styles.input}
              placeholder="Tên sản phẩm"
              value={updatedProductData.name}
              onChangeText={(text) => handleUpdateChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Trọng lượng (Gram)"
              value={updatedProductData.weight}
              onChangeText={(text) => handleUpdateChange("weight", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Giá đá quý (VND)"
              value={updatedProductData.gemCost}
              onChangeText={(text) => handleUpdateChange("gemCost", text)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.addButton2}
              onPress={handleSaveUpdate}
            >
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeModalUpdate}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal để nhập thông tin sản phẩm mới */}
      <Modal visible={modalVisibleAdd} animationType="slide" transparent={true}>
        <View style={[styles.modalContainer]}>
          <View style={styles.modalContent}>
            <Title className="font-semibold text-xl mb-10 text-[#ccac00]">
              Tạo Sản Phẩm Mới
            </Title>
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
  menuContainer: {
    position: "absolute",
    top: 5,
    right: -6,
    zIndex: 3, // Đặt zIndex cao hơn để đảm bảo menu hiển thị trên cùng
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    // backgroundColor: "#ffffff",
  },
  filterButton: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  card: {
    margin: 5,
    width: "47%", // Adjust width as per your design
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 20,
    marginTop: 10,
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
    top: 14,
    left: 13,
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
    zIndex: 2,
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
    top: 175,
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
  tooltipContainer: {
    backgroundColor: "white",
    top: -40,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default ProductManagementScreen;
