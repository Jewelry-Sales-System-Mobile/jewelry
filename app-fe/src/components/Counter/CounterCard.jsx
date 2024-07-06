import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";

export default function CounterCard({ counters  }) {
  return (
    <View>
      <FlatList
       data={counters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            //    style={styles.card}
            onPress={() => navigation.navigate("Detail", { id:item._id })}
          >
            <Text
              //    style={styles.perfumeName}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.counter_name}
            </Text>
            <View >
              <Text >${item.updated_at}</Text>
            </View>
          </Pressable>
        )}
      //  contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}
