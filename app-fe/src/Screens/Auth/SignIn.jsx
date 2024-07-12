import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet, Image,
} from "react-native";
import { useSignIn } from "../../API/auth";
import { Feather } from "@expo/vector-icons";

export default function SignIn() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  // const [isEmailFocused, setIsEmailFocused] = useState(false);
  // const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");
  const signInData = {
    email: "baotest1@gmail.com",
    password: "Bao0105*",
  };
  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };
  const { mutate: signIn } = useSignIn();

  const handleSignIn = () => {
    signIn(loginData);
  };
  const handleChange = (key, value) => {
    setLoginData({
      ...loginData,
      [key]: value,
    });
  };
  return (
    <View className="flex mx-auto my-auto bg-white w-full h-full">
      <View className="mx-auto my-auto w-full">
      <Image 
          source={require("../../../assets/jewelryLogo.png")} 
          className="w-[160px] h-[120px] items-center mx-auto mb-2"
        />
        {/* <Text className="text-center text-2xl font-bold text-amber-700">
          Xin Chào
        </Text> */}
        <Text className="w-full text-center mt- mb-7 text-slate-700 text-base italic">
          Chào mừng bạn trở lại, vui lòng đăng nhập
        </Text>
        <View className="px-3">
        <Text className="mx-3 my-2 text-lg text-slate-700 font-medium">Email</Text>
        <TextInput
          placeholder="Email"
          // value={loginData.email}
          onChangeText={(text) => handleChange("email", text)}
          style={styles.input}
          // className=" border-[1px] border-slate-300 p-2 rounded-3xl text-lg mx-7"
        />
        </View>
       
        <View className="my-3 px-3">
          <Text className="my-2 mx-3 text-lg text-slate-700 font-medium">
            Password
          </Text>
          <View className="flex flex-row mx-7  border-[1px] border-slate-300 p-2 rounded-3xl">
            <TextInput
              name="password"
              placeholder="Enter password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={passwordVisibility}
              // value={loginData.password}
              enablesReturnKeyAutomatically
              onChangeText={(text) => handleChange("password", text)}
              className=" w-5/6 text-lg ml-3 text-slate-400"
            />
            <TouchableOpacity
              onPress={handlePasswordVisibility}
              className="w-1/6"
            >
              <Feather name={rightIcon} size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          className="mx-auto mt-8 bg-amber-700 rounded-3xl"
          onPress={() => handleSignIn()}
        >
          <Text className=" text-xl text-white px-11 py-2 font-semibold">ĐĂNG NHẬP</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.cancelButton} onPress={closeModalAdd}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#A9AEB3", // Equivalent to border-slate-300
    padding: 12, // Equivalent to p-2
    borderRadius: 30, // Approximation for rounded-3xl
    fontSize: 18, // Equivalent to text-lg
    marginLeft: 28, // Equivalent to mx-7
    marginRight: 28, // Equivalent to mx-7
    color: "#A9AEB3",
    paddingHorizontal: 20,
  },
});
