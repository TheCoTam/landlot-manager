import { Text, TouchableOpacity, View } from "react-native";

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const RadioButton = ({ label, selected, onPress }: RadioButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row items-center gap-1"
    >
      <View className="w-4 h-4 rounded-full border-2 items-center justify-center border-gray-500">
        {selected && <View className="w-2 h-2 rounded-full bg-gray-500" />}
      </View>
      <Text className="text-xs">{label}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;
