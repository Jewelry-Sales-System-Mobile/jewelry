import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
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
import ImageResizer from "../ResizeImage/resizeImage";
import { showErrorMessage } from "../../../Utils/notifications";

const MAX_NAME_LENGTH = 70;
const MAX_WEIGHT = 1000; // in grams
const MAX_GEM_COST = 1000000000; // 1 billion VND
const WEIGHT_DECIMAL_PLACES = 2;
const MIN_WEIGHT = 5; // Minimum weight in grams
const MIN_GEM_COST = 50000; // Minimum gem cost in VND

const ProductManagementScreen = () => {
  const { data: products, isLoading, error, isFetching } = useGetProducts();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProductImage } = useDeleteProductImage();
  const { mutate: addProductImage } = useAddProductImage();
  const { mutate: inactivateProduct } = useInactivateProduct();
  const { mutate: activateProduct } = useActivateProduct();

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
    weight: "",
    gemCost: "",
  });
  const [initialProductData, setInitialProductData] = useState({
    name: "",
    weight: "",
    gemCost: "",
  });
  const [tooltipVisible, setTooltipVisible] = useState(false); // State to control tooltip visibility
  const [tooltipText, setTooltipText] = useState(""); // State to hold tooltip text
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});
  // Dropdown menu actions
  const [visible, setVisible] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6); // Số sản phẩm hiển thị ban đầu
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    if (modalVisibleUpdate) {
      // Set the initial product data when the modal opens
      setInitialProductData(updatedProductData);
    }
  }, [modalVisibleUpdate]);

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleChange = (key, value) => {
    if (key === "weight" || key === "gemCost") {
      let numericValue = value.replace(/[^0-9.]/g, "");

      if (key === "weight") {
        if (numericValue.split(".").length > 2) {
          return;
        }
        if (numericValue.includes(".")) {
          const [intPart, decimalPart] = numericValue.split(".");
          if (decimalPart.length > WEIGHT_DECIMAL_PLACES) {
            numericValue = `${intPart}.${decimalPart.slice(
              0,
              WEIGHT_DECIMAL_PLACES
            )}`;
          }
        }
        const parsedWeight = parseFloat(numericValue);
        if (parsedWeight > MAX_WEIGHT) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            weight: `Trọng lượng không quá ${MAX_WEIGHT} Gram`,
          }));
          return;
        } else if (parsedWeight < MIN_WEIGHT) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            weight: `Trọng lượng tối thiểu là ${MIN_WEIGHT} Gram`,
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, weight: null }));
        }
      } else if (key === "gemCost") {
        const parsedGemCost = parseInt(numericValue, 10);
        if (parsedGemCost > MAX_GEM_COST) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            gemCost: `Giá đá quý không quá ${MAX_GEM_COST.toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )} VND`,
          }));
          return;
        } else if (parsedGemCost < MIN_GEM_COST) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            gemCost: `Giá đá quý tối thiểu là ${MIN_GEM_COST.toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )} VND`,
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, gemCost: null }));
        }
      }

      setNewProductData((prevState) => ({
        ...prevState,
        [key]: numericValue,
      }));
    } else if (key === "name") {
      if (value.length > MAX_NAME_LENGTH) {
        setErrors((prevErrors) => ({ ...prevErrors, name: "Tên quá dài" }));
        return;
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, name: null }));
      }
      setNewProductData((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }
  };

  // Kiểm tra xem dữ liệu nhập vào có hợp lệ hay không cho TẠO SẢN PHẨM
  const isFormValidAdd = () => {
    // Kiểm tra các trường thông tin
    if (!newProductData.name) {
      return false;
    }

    // Kiểm tra trường weight
    if (!newProductData.weight) {
      return false;
    }
    const parsedWeight = parseFloat(newProductData.weight);
    if (
      isNaN(parsedWeight) ||
      parsedWeight < MIN_WEIGHT ||
      parsedWeight > MAX_WEIGHT
    ) {
      return false;
    }

    // Kiểm tra trường gemCost
    if (!newProductData.gemCost) {
      return false;
    }
    const parsedGemCost = parseInt(newProductData.gemCost, 10);
    if (
      isNaN(parsedGemCost) ||
      parsedGemCost < MIN_GEM_COST ||
      parsedGemCost > MAX_GEM_COST
    ) {
      return false;
    }

    // Nếu các trường đều hợp lệ
    return true;
  };

  // Kiểm tra xem dữ liệu nhập vào có hợp lệ hay không cho CẬP NHẬT SẢN PHẨM
  const isFormValidUpdate =
    updatedProductData.name &&
    updatedProductData.weight &&
    updatedProductData.gemCost &&
    (updatedProductData.name !== initialProductData.name ||
      updatedProductData.weight !== initialProductData.weight ||
      updatedProductData.gemCost !== initialProductData.gemCost) &&
    !errors.name &&
    !errors.weight &&
    !errors.gemCost;

  const handleUpdateChange = (key, value) => {
    if (key === "weight" || key === "gemCost") {
      let numericValue = value.replace(/[^0-9.]/g, "");

      if (key === "weight") {
        if (numericValue.split(".").length > 2) {
          return;
        }
        if (numericValue.includes(".")) {
          const [intPart, decimalPart] = numericValue.split(".");
          if (decimalPart.length > WEIGHT_DECIMAL_PLACES) {
            numericValue = `${intPart}.${decimalPart.slice(
              0,
              WEIGHT_DECIMAL_PLACES
            )}`;
          }
        }
        const parsedWeight = parseFloat(numericValue);
        if (parsedWeight > MAX_WEIGHT) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            weight: `Trọng lượng không quá ${MAX_WEIGHT} Gram`,
          }));
          return;
        } else if (parsedWeight < MIN_WEIGHT) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            weight: `Trọng lượng tối thiểu là ${MIN_WEIGHT} Gram`,
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, weight: null }));
        }
      } else if (key === "gemCost") {
        const parsedGemCost = parseInt(numericValue, 10);
        if (parsedGemCost > MAX_GEM_COST) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            gemCost: `Giá đá quý không quá ${MAX_GEM_COST.toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )} VND`,
          }));
          return;
        } else if (parsedGemCost < MIN_GEM_COST) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            gemCost: `Giá đá quý tối thiểu là ${MIN_GEM_COST.toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )} VND`,
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, gemCost: null }));
        }
      }

      setUpdatedProductData((prevState) => ({
        ...prevState,
        [key]: numericValue,
      }));
    } else if (key === "name") {
      if (value.length > MAX_NAME_LENGTH) {
        setErrors((prevErrors) => ({ ...prevErrors, name: "Tên quá dài" }));
        return;
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, name: null }));
      }
      setUpdatedProductData((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }
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

  const handleAddImage = async (imageProduct) => {
    const options = {
      mediaType: "photo",
      includeBase64: true,
    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        console.log("Selected image: ", selectedImage.uri);

        try {
          // Convert Base64 to Blob
          const base64Data = selectedImage.base64;
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: selectedImage.type });

          // Compress Blob (if needed)
          const compressedBlob = await compressBlob(blob);

          // Create FormData and append Blob
          const formData = new FormData();
          formData.append("image", {
            uri: selectedImage.uri,
            type: selectedImage.type || "image/jpeg",
            name: selectedImage.fileName || "photo.jpg",
            data: compressedBlob,
          });

          // Call API to add image to product
          await addProductImage({
            productId: imageProduct._id,
            imageFile: formData,
          });
        } catch (error) {
          console.error("Error handling image: ", error);
          showErrorMessage("Failed to handle image. Please try again.");
        }
      }
    });
  };

  const compressBlob = async (blob) => {
    return new Promise((resolve, reject) => {
      // Implement your image compression logic here
      // Example: Use canvas to resize and compress image
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set the desired width and height (e.g., 800x800)
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (compressedBlob) => {
              resolve(compressedBlob);
            },
            "image/jpeg",
            0.6
          );
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
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
      if (value == null || isNaN(value)) return "0 VND";
      const numValue = Number(value); // Convert value to a number
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(numValue.toFixed(2));
    };

    const formattedPrice = formatCurrency(item?.basePrice);

    // const clearErrorAfterTimeout = (key) => {
    //   setTimeout(() => {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       [key]: null,
    //     }));
    //   }, 3000); // 3 seconds timeout
    // };

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
              onPress={handleAddImage}
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
        <View style={styles.buttonContainer2} onPress={openModalAdd}>
          <TouchableOpacity
            className="flex-row  bg-[#ccac00] p-2 rounded-md mb-4 "
            onPress={openModalAdd}
          >
            <FontAwesome name="plus" size={20} color="white" />
            {/* <Text style={{ color: "white", marginLeft: 10 }}>Tạo Sản Phẩm</Text> */}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm tên hoặc mã sản phẩm..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <FilterDropdown onFilterChange={handleFilterChange} />
      </View>
      {products && (
        <Text className="my-2 ml-2 font-semibold">
          Tổng có: {products.length} Sản phẩm
        </Text>
      )}
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
            <Title className="font-semibold text-xl mb-5 text-[#ccac00]">
              Cập Nhật Sản Phẩm
            </Title>
            <View className="w-full">
              <Text className="text-[12px] font-semibold mb-2">
                Tên sản phẩm
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Tên sản phẩm"
                value={updatedProductData.name}
                onChangeText={(text) => handleUpdateChange("name", text)}
                mode="outlined"
              />
              <Text className=" text-right text-[12px]">
                {updatedProductData.name.length}/{MAX_NAME_LENGTH}
              </Text>
            </View>
            <View className="w-full ">
              <Text className="text-[12px] font-semibold mb-2">
                Trọng lượng (Gram)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Trọng lượng (Gram)"
                value={updatedProductData.weight}
                onChangeText={(text) => handleUpdateChange("weight", text)}
                keyboardType="numeric"
                mode="outlined"
              />
              {errors.weight && (
                <Text style={styles.errorText}>{errors.weight}</Text>
              )}
            </View>

            <View className="w-full ">
              <Text className="text-[12px] font-semibold mb-2">
                Giá đá quý (VND)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Giá đá quý (VND)"
                value={updatedProductData.gemCost}
                onChangeText={(text) => handleUpdateChange("gemCost", text)}
                keyboardType="numeric"
                mode="outlined"
              />
              {errors.gemCost && (
                <Text style={styles.errorText}>{errors.gemCost}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.addButton2,
                (!isFormValidUpdate ||
                  errors.name ||
                  errors.weight ||
                  errors.gemCost) &&
                  styles.disabledButton,
              ]}
              onPress={handleSaveUpdate}
              disabled={
                !isFormValidUpdate ||
                errors.name ||
                errors.weight ||
                errors.gemCost
              }
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
            <Title className="font-semibold text-xl mb-5 text-[#ccac00]">
              Tạo Sản Phẩm Mới
            </Title>
            <View className="w-full">
              <Text className="text-[12px] font-semibold mb-2">
                Tên sản phẩm
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Tên sản phẩm"
                value={newProductData.name}
                onChangeText={(text) => handleChange("name", text)}
                mode="outlined"
              />
              <Text className=" text-right text-[12px]">
                {newProductData.name.length}/{MAX_NAME_LENGTH}
              </Text>
            </View>
            <View className="w-full ">
              <Text className="text-[12px] font-semibold mb-2">
                Khối lượng (gram)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Khối lượng (gram)"
                value={newProductData.weight}
                onChangeText={(text) => handleChange("weight", text)}
                keyboardType="numeric"
                mode="outlined"
              />
              {errors.weight && (
                <Text style={styles.errorText}>{errors.weight}</Text>
              )}
            </View>
            <View className="w-full ">
              <Text className="text-[12px] font-semibold mb-2">
                Chi phí đá (VND)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Chi phí đá (VND)"
                value={newProductData.gemCost}
                onChangeText={(text) => handleChange("gemCost", text)}
                keyboardType="numeric"
                mode="outlined"
              />
              {errors.gemCost && (
                <Text style={styles.errorText}>{errors.gemCost}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.addButton2,
                !isFormValidAdd() && styles.disabledButton,
              ]}
              onPress={handleCreateProduct}
              disabled={!isFormValidAdd()}
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#9E9E9E",
  },
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
    backgroundColor: "#ffffff",
  },
  filterButton: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 5,
    width: "47%", // Adjust width as per your design
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
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
