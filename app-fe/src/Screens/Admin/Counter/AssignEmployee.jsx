import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAssignEmployee, useGetCounterById } from '../../../API/counter';

export default function AssignEmployee() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: counterId } = route.params;
  const { data, isLoading: counterLoading, error: counterError } = useGetCounterById(counterId);

  const [employeeId, setEmployeeId] = useState('');
  const { mutate: assignEmployee, isLoading: assignLoading, error: assignError } = useAssignEmployee();

  if (counterLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (counterError) {
    console.error("Error loading counter:", counterError);
    return (
      <View style={styles.container}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  if (assignError) {
    console.error("Error assign employee:", assignError);
    return (
      <View style={styles.container}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    if (employeeId) {
      assignEmployee({ counterId, employeeId }, {
        onSuccess: () => {
          navigation.goBack();
        }
      });
    } else {
      alert("Please enter a valid employee ID");
    }
  };

  return (
    <View className='flex-1 bg-white p-4'>
      <View className='mt-4 mb-8'>
      <Text className='uppercase font-semibold text-center text-lg mb-4'>Phân công nhân viên</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
      />
      <Button
       style={{backgroundColor:"#ccac00"}}
        title={assignLoading ? "Assigning..." : "Assign Employee"}
        onPress={handleSubmit}
        disabled={assignLoading}
      />
      {assignError && <Text style={styles.error}>Failed to assign employee. Please try again.</Text>}
      </View>
     
      <Text className='text-lg uppercase font-semibold border-black border-b-2 pb-1 mb-4'>Thông tin quầy hàng</Text>
      <Text className='px-6 mb-2 text-base text-gray-600'>Tên quầy: <Text className='text-black font-semibold'>{data?.counter_name}</Text></Text>
     
      {data?.assignedEmployees.length === 0 ? (
          <View className="flex flex-row items-center my-3">
             <Text className='mr-4 text-base mb-2 text-gray-600'>Nhân viên phụ trách:</Text>
            <Text className="text-base italic text-red-400 font-medium">
              Chưa có thông tin
            </Text>
          </View>
        ) : (
          <View className="flex flex-col px-6 mb-2">
             <Text className='mr-4 text-base mb-2 text-gray-600'>Nhân viên phụ trách:</Text>
            {data?.assignedEmployees?.map((employee, index) => (
              <View key={index} className="flex flex-row justify-between mb-2">
                <Text className='text-base mb-2'>ID nhân viên {index + 1}:</Text>
                <Text className=' mb-2 font-semibold'>{employee}</Text>
              </View>
            ))}
          </View>
        )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
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
