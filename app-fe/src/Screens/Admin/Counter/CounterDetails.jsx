import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetCounterById } from '../../../API/counter';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function CounterDetails() {
  const route = useRoute();
  const { id: counterId } = route.params;
  console.log(counterId)
  const { data, isLoading, error } = useGetCounterById(counterId);
  console.log(data)
  // if (isLoading) {
  //   return <View><Text>Loading...</Text></View>;
  // }

  // if (error) {
  //   console.error('Error loading counters:', error);
  //   return <View><Text>Error loading data: {error.message}</Text></View>;
  // }
  // const [counter,setCounter] = useState({})
  // const getAllProject = async () => {
  //   try {
  //     const response = await axios.get(`http://192.168.1.12:4000/counters/${counterId}`);
  
  //     setCounter(response.data);
  //      console.log(response.data)
      
  //   } catch (error) {
  //     console.error("Error fetching request:", error);
  //     //setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getAllProject();
  // }, [counterId]);

  return (
    <View>
      <Text>Tên quầy: <Text>{data.counter_name}</Text></Text>
    </View>
  )
}