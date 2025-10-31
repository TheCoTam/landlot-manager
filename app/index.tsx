import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function Index() {
  return (
    <View className="items-center justify-center flex-1 gap-16">
      <Text className="font-semibold text-2xl">
        Edit app/index.tsx to edit this screen. hahah
      </Text>
      <TouchableOpacity
        onPress={() => {
          router.push("/excel");
        }}
      >
        <Text>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}
