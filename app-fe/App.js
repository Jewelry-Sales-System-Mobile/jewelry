import { NativeWindStyleSheet } from "nativewind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "react-query";
import Main from "./src/components/Main";
import { setToken } from "./src/Utils/http";
import FlashMessage from "react-native-flash-message";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { NativeBaseProvider, Box } from "native-base";
import { MenuProvider } from "react-native-popup-menu";

const Stack = createNativeStackNavigator();
NativeWindStyleSheet.setOutput({
  default: "native",
});
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <PaperProvider>
          <NativeBaseProvider>
            <MenuProvider>
              <Main />
            </MenuProvider>
          </NativeBaseProvider>
        </PaperProvider>
      </NavigationContainer>
      <FlashMessage position="left" />
    </QueryClientProvider>
  );
}
