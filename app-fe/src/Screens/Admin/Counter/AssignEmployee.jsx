import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAssignEmployee } from '../../../API/counter';

export default function AssignEmployee() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: counterId } = route.params;

  const [employeeId, setEmployeeId] = useState('');
  const { mutate: assignEmployee, isLoading, error } = useAssignEmployee();

  const handleSubmit = () => {
    if (employeeId) {
      assignEmployee({ counterId, employeeId });
    } else {
      alert("Please enter a valid employee ID");
    }
  };

  return (
    <View className='bg-white flex-1'>
      <Text>Thông tin quầy</Text>
      <Text style={styles.title}>Assign Employee</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
      />
      <Button
        title={isLoading ? "Assigning..." : "Assign Employee"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
      {error && <Text style={styles.error}>Failed to assign employee. Please try again.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
});
