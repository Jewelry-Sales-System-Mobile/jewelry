import { View ,Text} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "@rneui/themed";
import { tailwind } from "nativewind";
import CounterCard from "../../components/Counter/CounterCard";
import { useGetCounters } from "../../API/counter";
import { API_ENDPOINTS } from "../../API/api-endpoint";
import axios from "axios";

export default function ManageCounter() {
  const { data, isLoading, error } = useGetCounters();
  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
  };

  const [counter, setCounter] = useState([])


 if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (error) {
    console.error('Error loading counters:', error);
    return <View><Text>Error loading data: {error.message}</Text></View>;
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="bg-white flex flex-col items-center justify-center mx-auto">
        <View className="m-3 rounded-xl w-[350px] bg-white">
          {/* <SearchBar
            placeholder="Type Here..."
            onChangeText={updateSearch}
            value={search}
            containerStyle={'bg-white'}
            inputContainerStyle='bg-white rounded-xl'
          /> */}
        </View>
        <CounterCard counters={data}/>
      </View>
    </SafeAreaView>
  );
}
