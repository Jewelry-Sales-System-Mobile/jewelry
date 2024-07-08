import { View, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "@rneui/themed";
import { tailwind } from "nativewind";
import CounterCard from "../../../components/Counter/CounterCard";
import { useGetCounters } from "../../../API/counter";
import { Searchbar } from "react-native-paper";

export default function ManageCounter() {
  const { data, isLoading, error } = useGetCounters();

  const [searchQuery, setSearchQuery] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
  };

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
        <View className="mx-3 mt-0 mb-2 rounded-xl w-[350px] bg-white">
          <Searchbar
            placeholder="Tìm kiếm..."
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </View>
        <CounterCard counters={data} />
      </View>
    </SafeAreaView>
  );
}
