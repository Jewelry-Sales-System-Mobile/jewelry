import { View, Text } from "react-native";
import React, { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Searchbar } from "react-native-paper";

import CounterCard from "../../../components/Counter/CounterCard";
import { useGetCounters } from "../../../API/counter";

export default function ManageCounter({ navigation }) {
  const { data, isLoading, error } = useGetCounters();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFABOpen, setIsFABOpen] = useState(false);

  const filteredCounters = useMemo(() => {
    if (!data) return [];
    return data.filter((counter) =>
      counter.counter_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

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
    <SafeAreaView className="bg-white flex flex-1 justify-center -mt-5">
      <View className="bg-white flex flex-1 items-center justify-center px-3">
        <View className="mx-3 mt-10 mb-2 rounded-xl w-[350px] bg-white">
          <Searchbar
            placeholder="Tìm kiếm..."
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </View>
        
        <CounterCard counters={filteredCounters} />

        <FAB.Group
          open={isFABOpen}
          icon={isFABOpen ? "close" : "plus"}
          actions={[
            {
              icon: "plus",
              label: "Thêm quầy hàng",
              onPress: () => navigation.navigate("Tạo quầy hàng mới"),
              small: false,
            },
          ]}
          onStateChange={({ open }) => setIsFABOpen(open)}
          style={{
            position: 'absolute',
            margin: 30,
            right: 0,
            bottom: 0,
          }}
          fabStyle={{
            backgroundColor: "#ccac00",
          }}
        />
      </View>
    </SafeAreaView>
  );
}
