import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const useResetScreen = (resetFunction) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      resetFunction();
    });

    return unsubscribe;
  }, [navigation, resetFunction]);
};

export default useResetScreen;
