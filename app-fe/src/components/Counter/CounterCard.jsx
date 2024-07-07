import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Ionicons";

export default function CounterCard({ counters }) {
  const navigation = useNavigation();
  const [showAll, setShowAll] = useState(false);
  const displayedData = showAll ? counters : counters.slice(0, 5);

  return (
    <View className="flex flex-1 w-full px-2">
      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            className="bg-white flex border-t-2 border-neutral-200 px-6 pt-5 pb-3 rounded-lg shadow-lg shadow-black/25 mb-3"
            onPress={() => navigation.navigate("Chi tiết quầy hàng", { id: item._id })}
          >
            <View className="w-full">
              <View className="flex flex-row justify-between">
                <Text
                  className="text-lg line-clamp-1 w-3/4 font-semibold mb-2"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.counter_name}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Chi tiết quầy hàng", { id: item._id })
                  }
                >
                  <Icon
                    name="arrow-forward"
                    size={30}
                    // color={isFavorite(perfumeDetail.id) ? "#F4B5A4" : "#A6A5A5"}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <Text>
                  Cập nhật lần cuối:{" "}
                  {format(new Date(item.updated_at), "dd-MM-yyyy HH:mm")}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
      {!showAll && (
        <Pressable onPress={() => setShowAll(true)} className="mb-5 items-center p-5">
          <Text className="font-semibold italic">Xem thêm...</Text>
        </Pressable>
      )}
    </View>
  );
}
