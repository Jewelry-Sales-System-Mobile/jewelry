import { View, Text } from 'react-native'
import React from 'react'
import { useRoute, useNavigation } from "@react-navigation/native";

export default function UpdateCounter() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: counterId } = route.params;
  return (
    <View>
      <Text>UpdateCounter</Text>
    </View>
  )
}