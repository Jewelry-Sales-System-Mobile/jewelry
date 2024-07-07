import { NativeWindStyleSheet } from "nativewind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "react-query";
import Main from "./src/components/Main";
const Stack = createNativeStackNavigator();
NativeWindStyleSheet.setOutput({
  default: "native",
});
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}
