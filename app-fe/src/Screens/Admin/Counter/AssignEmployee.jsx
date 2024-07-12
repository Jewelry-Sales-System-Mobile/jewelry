import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute} from "@react-navigation/native";
import { useAssignEmployee, useGetCounterById, useUnassignEmployee } from '../../../API/counter';
import { useGetAllFreeStaff, useGetStaffById } from '../../../API/staffApi';
import { Select, CheckIcon } from 'native-base';
import Ionicons from "react-native-vector-icons/Ionicons";
import EmployeeDetails from '../../../components/Counter/EmployeeDetails';
import { Dialog, Portal, Button, Paragraph } from 'react-native-paper';

export default function AssignEmployee({navigation}) {
  const route = useRoute();
  const { id: counterId } = route.params;
  const { data: counterData, isLoading: counterLoading, error: counterError } = useGetCounterById(counterId);
  const { data: staffData, isLoading: staffLoading, error: staffError } = useGetAllFreeStaff();
 
  const [employeeId, setEmployeeId] = useState('');
  const { mutate: assignEmployee, isLoading: assignLoading, error: assignError } = useAssignEmployee();
  const { mutate: unassignEmployee } = useUnassignEmployee();

  const [dialogVisible, setDialogVisible] = useState(false); 
  const [employeeToUnassign, setEmployeeToUnassign] = useState(null); 
  const [employeeName, setEmployeeName] = useState("");
  const { data: employeeData } = useGetStaffById(employeeToUnassign);

  useEffect(() => {
    if (employeeData) {
      setEmployeeName(employeeData.name); 
    }
  }, [employeeData]);

  if (counterLoading || staffLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (counterError || staffError) {
    console.error("Error loading counter:", counterError || staffError);
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
      assignEmployee({ counterId, employeeId });
    } else {
      alert("Please enter a valid employee ID");
    }
  };

  const handleUnassignEmployee = (employeeId) => {
    setEmployeeToUnassign(employeeId);
    setDialogVisible(true);
  };

  const confirmUnassignEmployee = () => {
    if (employeeToUnassign) {
      unassignEmployee({ counterId, employeeId: employeeToUnassign });
      setDialogVisible(false);
    }
  };

  return (
    <View className='flex-1 bg-white p-4'>
      <View className='mt-4 mb-8'>
      <Text className='font-medium text-base mb-1'>Chọn nhân viên</Text>

       <Select
        selectedValue={employeeId}
        minWidth="200"
        accessibilityLabel="Chọn nhân viên"
        placeholder="Chọn nhân viên"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />
        }}
        mt={1}
        onValueChange={(itemValue) => setEmployeeId(itemValue)}
      >
        {staffData.map((employee) => (
          <Select.Item key={employee._id} label={employee.name} value={employee._id} />
        ))}
      </Select>
      <TouchableOpacity
        style={[styles.button, assignLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={assignLoading}
      >
        {assignLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Phân công nhân viên</Text>
        )}
      </TouchableOpacity>
      {assignError && <Text style={styles.error}>Failed to assign employee. Please try again.</Text>}
      </View>

      <View className='flex flex-row items-center gap-2 mb-3'>
      <Ionicons name="checkmark-done-sharp" size={28} color="green" />
      <Text className='text-lg uppercase font-semibold'>Đang phụ trách quầy ({counterData?.assignedEmployees.length})</Text>
      </View>
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Icon icon="alert" color="#ccac00" size={30}/>
          <Dialog.Title className="text-center font-medium">Xoá nhân viên?</Dialog.Title>
          <Dialog.Content>
            <Paragraph className="text-center italic text-base">Bạn có chắc chắn muốn xoá nhân viên <Text className="font-semibold text-red-500">{employeeName}</Text> khỏi quầy?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} ><Text className="text-black">Huỷ</Text></Button>
            <Button onPress={confirmUnassignEmployee}>Đồng ý</Button>
          </Dialog.Actions>
        </Dialog>       
      </Portal>
     
      {counterData?.assignedEmployees.length === 0 ? (
          <View className="items-center my-3">
          <Ionicons name="file-tray" size={50} color="#A6A5A5" />
          <Text className="text-base italic text-red-400 font-medium">
            Chưa có nhân viên nào phụ trách quầy
          </Text>
        </View>
        ) : (
          <View className="flex flex-col px-1 mb-2">
            {counterData?.assignedEmployees?.map((employeeId, index) => (
              <EmployeeDetails key={index} employeeId={employeeId} onUnassign={handleUnassignEmployee} index={index}/>
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
  button: {
    backgroundColor: '#ccac00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b3a200',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
