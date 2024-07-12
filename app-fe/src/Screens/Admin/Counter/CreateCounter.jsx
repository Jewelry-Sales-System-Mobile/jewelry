import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useCreateCounter } from '../../../API/counter'; // Ensure this path is correct

export default function CreateCounter() {
  const [counterName, setCounterName] = useState('');
  const navigation = useNavigation();
  const { mutate: createCounter, isLoading: createLoading } = useCreateCounter();

  const handleSubmit = () => {
    createCounter({ name: counterName }, {
      onSuccess: () => {
        navigation.goBack(); // Navigate back after successful creation
      },
    });
  };

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
        title={createLoading ? "Đang tạo..." : "Tạo quầy"}
        onPress={handleSubmit}
        disabled={createLoading}
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
