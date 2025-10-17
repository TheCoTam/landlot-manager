import { Bird, CircleQuestionMark, Plus } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmptyData = () => {
  const textClassName = "text-xl text-gray-600 font-semibold text-center";
  return (
    <SafeAreaView className="flex-1 justify-center gap-4 flex items-center">
      <Bird size={130} color={"gray"} />
      <View className="flex-row items-center flex-wrap">
        <Text className={textClassName}>
          Chọn một file bằng cách bấm vào dấu{" "}
        </Text>
        <View className="border border-gray-500 rounded-md p-1">
          <Plus size={16} color={"gray"} />
        </View>
      </View>
      <Text className={textClassName}>
        Hoặc bấm vào biểu tượng <CircleQuestionMark size={16} /> để xem hướng
        dẫn
      </Text>
      <Text className={textClassName}>
        Hoặc thay đổi bộ lọc để xem dữ liệu khác
      </Text>
    </SafeAreaView>
  );
};

export default EmptyData;
