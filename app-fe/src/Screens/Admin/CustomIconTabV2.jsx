// CustomTabIconV2.jsx
import React, { useState } from "react";
import { View, Image, Dimensions } from "react-native";
import { scale } from "react-native-size-scaling";
import { getPathDown } from "./cure";

const CustomTabIconV2 = ({ uri, isFocused }) => {
  const [maxWidth] = useState(Dimensions.get("window").width);
  const returnpathDown = getPathDown(maxWidth, 60, 50);

  return (
    <View
      style={{
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center",
        height: isFocused ? 56 : 36,
        width: isFocused ? 56 : 36,
        backgroundColor: isFocused ? "white" : "transparent",
        borderRadius: isFocused ? 35 : 0,
        bottom: isFocused ? 16 : 0,
      }}
    >
      <Image
        style={{
          width: isFocused ? 36 : 25,
          height: isFocused ? 36 : 25,
        }}
        source={{ uri }}
      />
    </View>
  );
};

export default CustomTabIconV2;
