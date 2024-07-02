import { NativeWindStyleSheet } from "nativewind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import Main from "./src/components/Main";
import { setToken } from "./src/Utils/http";
const Stack = createNativeStackNavigator();
NativeWindStyleSheet.setOutput({
  default: "native",
});
const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    setToken("hello ");
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}
