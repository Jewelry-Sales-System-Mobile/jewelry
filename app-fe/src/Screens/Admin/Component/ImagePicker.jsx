// ImagePicker.jsx

import { Platform } from "react-native";

let ImagePicker;

if (Platform.OS === "web") {
  ImagePicker = require("./ImagePickerWeb.jsx").default;
} else {
  console.log("Current Platform:", Platform.OS);
  ImagePicker = require("react-native-image-picker");
}

export default ImagePicker;
