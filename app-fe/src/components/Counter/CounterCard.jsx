import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { format } from "date-fns";


export default function CounterCard({ counters  }) {
  return (
    <View className="flex flex-1 w-full">
      <FlatList
        data={counters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            className="bg-white w-full border-t-2 border-neutral-200 px-3 py-5 rounded-lg items-center shadow-lg shadow-black/25"
            onPress={() => navigation.navigate("Detail", { id:item._id })}
          >
            <Text
              className="text-lg font-semibold"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.counter_name}
            </Text>
            <View >
              <Text >Cập nhật lần cuối: {format(new Date(item.updated_at), "dd-MM-yyyy HH:mm")}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
