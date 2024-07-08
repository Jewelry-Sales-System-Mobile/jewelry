import { View, Text, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetCustomers } from "../../../API/customer";

export default function CustomerManagementScreen() {
  const [showAll, setShowAll] = useState(false);

  const { data: customers, isLoading, error } = useGetCustomers();

  const displayedData =
    showAll || !Array.isArray(customers) ? customers : customers.slice(0, 5);
  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
  };
  // console.log(customers, isLoading, error);
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    console.error("Error loading counters:", error);
    return (
      <View>
        <Text>Error loading data: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white flex flex-1 justify-center">
      <View className="bg-white flex flex-1 items-center justify-center  p-3">
        <View className="m-3 rounded-xl w-[350px] bg-white">
          {/* <SearchBar
            placeholder="Type Here..."
            onChangeText={updateSearch}
            value={search}
            containerStyle={'bg-white'}
            inputContainerStyle='bg-white rounded-xl'
          /> */}
        </View>
        {/* <CounterCard counters={data} /> */}

        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            // Your component or JSX to render each item
            <View>
              {/* Example: Display item's name */}
              <Text>{item.name}</Text>
            </View>
          )}
        />
        {/* {!showAll && (
          <Pressable
            onPress={() => setShowAll(true)}
            className="mb-5 items-center p-5"
          >
            <Text className="font-semibold italic">Xem thêm...</Text>
          </Pressable>
        )} */}
      </View>
    </SafeAreaView>
  );
}
