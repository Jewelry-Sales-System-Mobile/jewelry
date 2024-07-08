import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Modal, Title } from "react-native-paper";
import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { set } from "date-fns";
import { DatePickerModal } from "react-native-paper-dates";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.number().required("Phone is required"),
  dob: Yup.date().required("Date of birth is required").nullable(),
  // Add other fields validation as needed
});

export default function AddCusModal({
  modalVisibleAdd,
  closeModalAdd,
  openModalAdd,
}) {
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
  });
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleChange = (key, value) => {
    setNewCustomerData({
      ...newCustomerData,
      [key]: value,
    });
  };

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  // setDate(params.date.toISOString());

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      if (params.date) {
        const day = params.date.getDate().toString().padStart(2, "0");
        const month = (params.date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is zero-based
        const year = params.date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        setDate(formattedDate);
        console.log(formattedDate, "params.date as formatted string");
      }
    },
    [setOpen, setDate]
  );
  const onSubmit = (data) => {
    console.log(data);
    // Handle your form submission logic here
  };
  return (
    <Modal visible={modalVisibleAdd} animationType="slide" transparent={true}>
      <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-5 rounded-lg w-full max-w-xs">
          <Title className="font-semibold text-center text-xl mb-4 text-[#ccac00]">
            Them Khach Hang Moi
          </Title>
          <Text className="text-slate-500">Ten Khach Hang</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Ten Khach Hang"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="text-lg border-b-[1px] p-2 border-slate-500 w-full mb-3"
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500">{errors.name.message}</Text>
          )}
          <Text className="text-slate-500">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Email"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="text-lg border-b-[1px] p-2 border-slate-500 w-full mb-3"
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500">{errors.email.message}</Text>
          )}
          <Text className="text-slate-500">So Dien Thoai</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="So Dien Thoai"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                className="text-lg border-b-[1px] p-2 border-slate-500 w-full mb-3"
              />
            )}
          />
          {errors.phone && (
            <Text className="text-red-500">{errors.phone.message}</Text>
          )}
          <Text className="text-slate-500">Ngay Sinh</Text>

          <Controller
            control={control}
            name="dob"
            render={({ field: { onChange, value } }) => (
              <View className="flex flex-row justify-between items-center w-full mb-3">
                <Text
                  className="w-2/3 border-b-[1px] border-slate-500 p-2"
                  onPress={() => setOpen(true)}
                >
                  {value ? value.toLocaleDateString() : "Select Date"}
                </Text>
                <TouchableOpacity
                  onPress={() => setOpen(true)}
                  className="text-white text-center bg-purple-400 ml-3 text-sm p-1 rounded-xl w-1/3"
                >
                  Select Date
                </TouchableOpacity>
                <DatePickerModal
                  locale="en"
                  mode="single"
                  visible={open}
                  onDismiss={onDismissSingle}
                  date={value}
                  onConfirm={onConfirmSingle}
                />
              </View>
            )}
          />
          {errors.dob && (
            <Text className="text-red-500">{errors.dob.message}</Text>
          )}
          <TouchableOpacity
            className="bg-[#ccac00] p-2.5 rounded-md mt-2.5 w-full items-center"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white">Thêm Khach Hang</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModalAdd}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    zIndex: 1,
    // height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    marginTop: 10,
  },
  buttonContainer2: {
    flexDirection: "row",
    zIndex: 2,
    alignItems: "center",
    marginTop: 10,
  },
  modalContainer: {
    position: "absolute", // Position the modal container absolutely to ensure it's on top
    top: 0, // Start from the top edge of the screen
    left: 0, // Start from the left edge of the screen
    right: 0, // Stretch to the right edge of the screen
    bottom: 0, // Stretch to the bottom edge of the screen
    justifyContent: "center", // Center children vertically
    alignItems: "center", // Center children horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background effect
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%", // Adjust width as needed
    maxWidth: 400, // Prevents the modal from becoming too wide on large screens
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton2: {
    backgroundColor: "#ccac00",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
});
