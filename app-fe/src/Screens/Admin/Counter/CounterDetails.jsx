import { View, Text } from 'react-native'
import React from 'react'
import { useGetCounterById } from '../../../API/counter';
import { useRoute } from '@react-navigation/native';

export default function CounterDetails({ route, navigation }) {
  //const route = useRoute();
  const { id: counterId } = route.params;
  const { data, isLoading, error } = useGetCounterById(counterId);
  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (error) {
    console.error('Error loading counters:', error);
    return <View><Text>Error loading data: {error.message}</Text></View>;
  }
  return (
    <View>
      <Text>Tên quầy: <Text>{data.counter_name}</Text></Text>
    </View>
  )
}