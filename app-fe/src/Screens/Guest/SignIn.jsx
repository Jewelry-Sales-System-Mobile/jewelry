import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSignIn } from "../../API/auth";

export default function SignIn() {
  const signInData = {
    email: "baotest1@gmail.com",
    password: "Bao0105*",
  };
  const { mutate: signIn } = useSignIn();

  const handleSignIn = () => {
    signIn(signInData);
  };

  return (
    <View className="flex text-center my-auto">
      <Text
        onPress={() => {
          handleSignIn();
        }}
      >
        Sign In
      </Text>
    </View>
  );
}
