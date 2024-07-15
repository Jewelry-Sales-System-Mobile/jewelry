import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { useGetCounterById, useUpdateCounter } from '../../../API/counter';

export default function UpdateCounter() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id: counterId } = route.params;
  
  const { data: counterData, isLoading: counterLoading, error: counterError } = useGetCounterById(counterId);
  const { mutate: updateCounter, isLoading: updateLoading, error: updateError } = useUpdateCounter();
  
  const [counterName, setCounterName] = useState('');

  useEffect(() => {
    if (counterData) {
      setCounterName(counterData.counter_name);
    }
  }, [counterData]);

  const handleSubmit = () => {
    if (counterName) {
      updateCounter(
        { counterId, counterName },
        {
          onSuccess: () => {
            navigation.goBack();
          },
        }
      );
    } else {
      alert("Please enter a valid counter name");
    }
  };

  if (counterLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (counterError || updateError) {
    console.error("Error loading counter or updating:", counterError || updateError);
    return (
      <View style={styles.container}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tên quầy</Text>
      <TextInput
        style={styles.input}
        value={counterName}
        onChangeText={setCounterName}
        placeholder="Tên quầy"
      />
      <Button
        title={updateLoading ? "Đang cập nhật..." : "Cập nhật"}
        onPress={handleSubmit}
        disabled={updateLoading}
        color="#ccac00"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});
