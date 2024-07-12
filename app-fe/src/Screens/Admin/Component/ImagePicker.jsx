// ImagePicker.jsx

import { Platform } from "react-native";

let ImagePicker;

if (Platform.OS === "web") {
  console.log("Current Platform:", Platform.OS);

  ImagePicker = require("./ImagePickerWeb.jsx").default;
} else {
  ImagePicker = require("react-native-image-picker");
}

export default ImagePicker;
