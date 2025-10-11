import { GUILD_RULES } from "@/Constants/Guild";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const GuildModal = ({ visible, onClose }: Props) => {
  const [index, setIndex] = useState(0);
  const translateX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePrevImage = () => {
    if (index > 0) {
      setIndex(index - 1);
      translateX.value = withTiming(-(index - 1) * 200, {
        duration: 300,
      });
    }
  };
  const handleNextImage = () => {
    if (index < GUILD_RULES.length - 1) {
      setIndex(index + 1);
      translateX.value = withTiming(-(index + 1) * 200, {
        duration: 300,
      });
    }
  };

  const handleCloseModal = () => {
    translateX.value = withTiming(0, { duration: 0 });
    setIndex(0);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleCloseModal}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-[85%]">
          <Text className="text-2xl font-bold mb-4">Hướng dẫn</Text>
          <View className="w-full h-[200px] flex flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handlePrevImage}
              className="p-1"
              disabled={index === 0}
            >
              <ChevronLeft />
            </TouchableOpacity>
            <View className="h-full aspect-square overflow-hidden">
              <Animated.View
                className="flex-1 flex flex-row"
                style={animatedStyle}
              >
                {GUILD_RULES.map((rule, idx) => (
                  <View key={idx} className="h-full aspect-square">
                    <Image
                      source={rule.image}
                      resizeMode="contain"
                      className="w-full h-full"
                    />
                  </View>
                ))}
              </Animated.View>
            </View>
            <TouchableOpacity
              onPress={handleNextImage}
              className="p-1"
              disabled={index === GUILD_RULES.length - 1}
            >
              <ChevronRight />
            </TouchableOpacity>
          </View>

          <Text className="text-lg">{GUILD_RULES[index].description}</Text>

          <TouchableOpacity
            onPress={handleCloseModal}
            className="bg-blue-500 mt-4 rounded-lg p-3"
          >
            <Text className="text-white text-center">Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GuildModal;
